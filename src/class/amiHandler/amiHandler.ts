import {Socket} from 'net'
import AmiConfig from './interfaces/amiConfig.interface'
import serverHandler from '../serverHandler/serverHandler'
import AMIServerDependencies from './interfaces/amiServerDependencies.interface'
import * as net from 'net'
import loghandler from 'loghandler'
import AmiConfigSchema from './schemas/amiConfig.schema'
import AmiCommand from './interfaces/amiCommand.interface'
import {v4 as uuid} from 'uuid'
import DefaultAmiEvent from './interfaces/amiEvent.interface'
import AmiResponse from './interfaces/amiResponse.interface'

export class AmiHandler extends serverHandler {
  private connection: Socket | null = null
  private connectionTries: number[] = []
  private retryTimeout: number = 10
  private commands: {
    [key: string]: AmiCommand
  } = {}
  private receivedData = ''

  public constructor(protected deps: AMIServerDependencies, private opts: AmiConfig) {
    super(deps)
    const Log = this.GetLogObj(opts.log)
    this.Log = Log

    if (this.opts.retryTimeout) {
      this.retryTimeout = this.opts.retryTimeout
    }
  }

  public static Factory(opts: AmiConfig) {
    return new this({net, loghandler, uuid}, opts)
  }

  public static validateConfig(opts: unknown): opts is AmiConfig {
    const result = AmiConfigSchema.validate(opts, {allowUnknown: true})
    return result.error === undefined
  }

  public static getValidationErrors(opts: unknown) {
    return AmiConfigSchema.validate(opts, {allowUnknown: true}).error
  }

  public connect(): Promise<this> {
    return new Promise((res, rej) => {
      if (this.connection === null) {
        try {
          this.connection = this.deps.net.createConnection(this.opts)
          this.connection.setKeepAlive(true)
          this.connection.setNoDelay(true)
          this.connection.setEncoding('utf-8')

          this.connectionTries.push(Date.now())

          this.connection.once('connect', async () => {
            this.Log.info('New connection established with Asterisk Management Interface.')
            try {
              this.keepConnected(this.opts.keepConnected || false)
              await this.login()
              res(this)
            } catch (err) {
              rej(err)
            }
          })

          this.connection.on('timeout', () => {
            return rej(new Error(`Connection can't be established. Connection is Timeout!`))
          })

          this.connection.on('data', data => {
            this.read(data)
          })

          this.connection.on('error', err => {
            this.onError(err)
          })

          this.connection.on('close', this.emit.bind(this, 'close'))
          this.connection.on('connect', this.emit.bind(this, 'connect'))
          this.connection.on('end', this.emit.bind(this, 'end'))
        } catch (err) {
          rej(err)
        }
      } else {
        rej(new Error(`Connection can't be established. Connection already exists!`))
      }
    })
  }

  public keepConnected(keepConnected: boolean = true) {
    if (keepConnected && this.connection) {
      this.Log.debug(`Enable automatic reconnect to Asterisk Management Interface, when connection get closed.`)
      this.connection.on('close', this.reconnect)
    } else if (!keepConnected && this.connection) {
      this.Log.debug(`disable automatic reconnect to Asterisk Management Interface, when connection get closed.`)
      this.connection.removeListener('close', this.reconnect)
    } else {
      throw new Error(
        `Can not enable/disable automatic reconnect to Asterisk Management Interface, because there is no active connection established.`,
      )
    }
  }

  public disconnect() {
    this.keepConnected(false)

    if (this.connection) {
      this.connection.end()
      this.connection = null
    }
  }

  private onError(this: this, err: Error) {
    this.emit('error', err)
    this.Log.err(err)
  }

  private async login() {
    await this.sendCommand('login', {
      username: this.opts.username || '',
      secret: this.opts.password || '',
      events: this.opts.events ? 'on' : 'off',
    })

    return this
  }

  private reconnect(this: this) {
    this.connectionTries = this.connectionTries.filter(time => {
      return time - Date.now() < 60000
    })

    if ((this.opts.maxRetries && this.connectionTries.length < this.opts.maxRetries) || !this.opts.maxRetries) {
      this.Log.warning(`Try to reconnect to Asterisk Management Interface in ${this.retryTimeout / 1000} seconds`)
      setTimeout(() => {
        this.Log.info('Reconnection to Asterisk Management Interface!')
        this.connect()
      }, this.retryTimeout)

      if (!this.opts.maxRetries) {
        this.retryTimeout *= this.retryTimeout
      }
    } else {
      const error = new Error(
        `Can't reconnect to Asterisk Management Interface, because we reach maximal amount of retries in 1 minute.`,
      )
      this.Log.crit(error)
      this.emit('end', error)
    }
  }

  private formatCommand(command: AmiCommand) {
    const msg = []
    msg.push(`ActionID: ${command.id}`)
    msg.push(`Action: ${command.action}`)

    for (const objectKey in command.opts) {
      const key = objectKey.replace(/^\s*|\s*$/g, '').toLowerCase()
      let value = command.opts[objectKey]
      if (key.length > 0 && ['actionid', 'action', 'callback'].includes(key) === false) {
        switch (typeof value) {
          case 'object':
            if (value) {
              if (Array.isArray(value)) {
                const formatedValue = value
                  .map(function (e) {
                    return String(e)
                  })
                  .join(',')

                msg.push(`${key.substr(0, 1).toUpperCase() + key.substr(1)}: ${formatedValue}`)
              } else if (value instanceof RegExp === false) {
                const valueObj = value
                Object.keys(value).forEach(name => {
                  msg.push(key + ': ' + name + '=' + valueObj[name].toString())
                })
              }
            }
          case 'number':
          case 'bigint':
          case 'string':
            msg.push(`${key.substr(0, 1).toUpperCase() + key.substr(1)}: ${value.toString()}`)
        }
      }
    }

    msg.sort()

    return msg.join('\r\n') + '\r\n\r\n'
  }

  public sendCommand(action: AmiCommand['action'], opts: AmiCommand['opts'] = {}): Promise<AmiResponse> {
    return new Promise((res, rej) => {
      const command: AmiCommand = {
        id: new Date().getTime().toString(),
        action,
        opts,
        callback: (data: AmiResponse) => {
          res(data)
        },
      }

      const formatedCommand = this.formatCommand(command)

      try {
        if (this.connection) {
          this.commands[command.id] = command
          this.Log.debug(`Action: "${command.action}" with ActionID: ${command.id} to Asterisk Management Interface.`)
          this.connection.write(formatedCommand, 'utf-8', (err: Error) => {
            if (err) {
              rej(err)
            }
            this.Log.debug(
              `Action: "${command.action}" with ActionID: ${command.id} is successfully written to Asterisk Management Interface.`,
            )
          })
        } else {
          rej(
            new Error(
              `Couldn't write action "${command.action}" to Asterisk Management Interface, because there is no active connection established.`,
            ),
          )
        }
      } catch (err) {
        return rej(err)
      }
    })
  }

  private read(this: this, data: Buffer | string): void | false {
    this.receivedData += data.toString('utf-8')
    const messages = this.receivedData.split(/\r?\n\r?\n/)
    const items: string[][] = []
    for (const rawMsg of messages) {
      const msg: string[] = []
      const lines = rawMsg.split(/\r?\n/)

      for (const line of lines) {
        if (!line.match(/^Asterisk Call Manager\//)) {
          msg.push(line)
        }
      }
      items.push(msg)
    }

    if (items[items.length - 1][0] === '') {
      for (const item of items) {
        if (item[0].match(/^Response: .*$/)) {
          this.receivedData = ''
          this.readResponse(item)
        } else if (item[0].match(/^Event: .*$/)) {
          this.receivedData = ''
          this.readEvent(item)
        }
      }
    }
  }

  private readResponse(this: this, data: string[]) {
    const response = this.formatRawMSG(data) as AmiResponse
    if (this.commands[response.ActionID]) {
      this.commands[response.ActionID].callback(response)
      delete this.commands[response.ActionID]
    } else {
      this.Log.err('Recieved response from Astrisk Management Interface for an unknown action.', {
        response,
      })
    }
  }

  private readEvent(this: this, data: string[]) {
    this.receivedData = ''
    const obj = this.formatRawMSG(data) as DefaultAmiEvent
    this.emit('event', obj)
    this.emit(`event-${obj.Event}`, obj)
  }

  private formatRawMSG(this: this, data: string[]) {
    const obj: {[key: string]: string} = {}

    for (const line of data) {
      const match = new RegExp(/^([A-Z][a-zA-Z0-9]*):  ?(.*)$/).exec(line)
      if (match) {
        const name: string = match[1]
        const value: string = match[2]

        obj[name] = value
      }
    }

    return obj
  }
}

export default AmiHandler
