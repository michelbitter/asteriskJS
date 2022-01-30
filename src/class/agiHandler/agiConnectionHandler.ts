import {EventEmitter} from 'events'
import {Socket} from 'net'
import {
  AGIAnswerObject,
  CommandObject,
  CommandQueue,
  ContextHandlerDependencies,
  ContextHandlerSys,
  Status,
} from './interfaces'
import {v4} from 'uuid'
import {SingleConnection} from './interfaces/singleConnection.interface'

export default class extends EventEmitter {
  private current: null | CommandObject = null
  private commandQueue: CommandQueue = []
  private msg: string = ''
  private status: Status = Status.init
  private variablesList: {[key: string]: string} = {}

  constructor(private Deps: ContextHandlerDependencies, private Socket: Socket | SingleConnection) {
    super()
    this.init()
  }

  public static Factory(sys: ContextHandlerSys, connection: Socket | SingleConnection) {
    return new this(
      {
        uuid: v4,
        ...sys,
      },
      connection,
    )
  }

  private init() {
    this.on('error', this.Socket.emit.bind(this, 'error'))

    this.on('close', this.Socket.emit.bind(this, 'close'))

    this.on('hangup', () => {
      this.Deps.Log.debug('Connection hangup')
      Promise.resolve(this.close())
    })

    this.on('response', (response: any) => {
      if (this.current !== null) {
        const current = this.current
        current.callback(response)
      } else {
        this.Deps.Log.err(new Error('Received response without sending a command.'), {response})
      }

      this.setStatus(Status.ready)
    })
    this.on('variables', () => {})
    this.on('statusChanged', () => {
      if (this.status === Status.ready) {
        this.send()
      }
    })

    const self = this
    this.Socket.on('data', (data: Buffer | string) => {
      self.read(data)
    })
  }

  private read(this: this, data: Buffer | string) {
    this.msg += data.toString('utf-8')

    if (this.status === Status.init) {
      if (this.msg.indexOf('\n\n') < 0) return false
      this.readVariables(this.msg)
      this.setStatus(Status.ready)
    } else {
      this.setStatus(Status.busy)
      if (this.msg.indexOf('\n') < 0) return false
      this.readResponse(this.msg)
    }

    this.msg = ''
    return true
  }

  private readVariables(msg: string) {
    const lines = msg.split('\n')

    for (const line of lines) {
      const split = line.split(':')
      if (split.length === 2) {
        const name: string = split[0]
        const value: string = split[1]

        this.variablesList[name] = (value || '').trim()
      }
    }

    return this.emit('variables', this.variablesList)
  }

  public async close() {
    this.Socket.end()
  }

  private readResponse(line: string) {
    const parsed = /^(\d{3})(?: result=)([^(]*)(?:\((.*)\))?/.exec(line)

    if (!parsed) {
      return this.emit('hangup')
    }

    const response: AGIAnswerObject = {
      code: parseInt(parsed[1]),
      result: parsed[2].trim(),
      value: parsed[3] ? parsed[3] : undefined,
    }

    return this.emit('response', response)
  }

  private setStatus(status: Status) {
    this.Deps.Log.debug(`Update system status from "${this.status}" to "${status}"`)
    this.status = status
    this.emit('statusChanged')
  }

  private send() {
    if (this.status === Status.ready && this.commandQueue.length > 0) {
      this.setStatus(Status.busy)
      const cmd = this.commandQueue.shift() as CommandObject
      this.current = cmd
      this.Socket.write(`${cmd.msg}\n`)
      this.setStatus(Status.waiting)
    }
  }

  private defaultValidationFnc(response: AGIAnswerObject) {
    return response.code === 200
  }

  private sendCommand(msg: CommandObject['msg'], validation = this.defaultValidationFnc): Promise<AGIAnswerObject> {
    return new Promise((res, rej) => {
      this.commandQueue.push({
        msg,
        timestamp: new Date(),
        id: Symbol(this.Deps.uuid()),
        callback: (response: AGIAnswerObject) => {
          if (validation(response)) {
            res(response)
          } else {
            const err = new Error(`Received response is not valid for command "${msg}"`)
            this.Deps.Log.err(err, {response})
            rej(err)
          }
        },
      })
      this.send()
    })
  }

  public async answer() {
    return await this.sendCommand('ANSWER')
  }

  public async sayDigits(numbers: string, escape: string) {
    return await this.sendCommand(`SAY DIGITS ${numbers} ${escape}`)
  }

  public async hangup() {
    return await this.sendCommand(`HANGUP`)
  }

  public async sayAlpha(message: string) {
    return await this.sendCommand(`SAY ALPHA ${message} #`)
  }

  public async streamfile(filename: string, escapeDigit = '""', sampleOffset = undefined) {
    return await this.sendCommand(`STREAM FILE ${filename} ${escapeDigit}${sampleOffset ? ` ${sampleOffset}` : ''}`)
  }

  public async getData(filename: string, timeout?: number, maxdigits?: number) {
    return await this.sendCommand(`GET DATA ${filename} ${timeout ? timeout : 2000} ${maxdigits ? maxdigits : ''}`)
  }

  public async setVariable(name: string, value: string | number | boolean) {
    return await this.sendCommand(`SET VARIABLE ${name} "${value}"`)
  }

  public async exec(application: string, options?: string) {
    return await this.sendCommand(`EXEC ${application} ${options}`)
  }

  public async goSub(extension: string, priority: number, context?: string, args?: string) {
    if (!context) {
      context = this.variables.agi_context
    }
    return await this.sendCommand(`GOSUB "${context}" "${extension}" "${priority}"${args ? ` "${args}"` : ''}`)
  }

  public async getOption(filename: string, escapeDigits = '""', timeout = 5000) {
    return await this.sendCommand(`GET OPTION ${filename} ${escapeDigits} ${timeout}`)
  }

  public get variables() {
    return this.variablesList
  }

  public set variables(value: any) {
    value
    throw new Error('Context variables can not be overridden or written.')
  }
}
