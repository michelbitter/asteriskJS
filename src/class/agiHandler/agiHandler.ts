import {AgiServerDependencies} from './interfaces/agiServerDependencies.interface'
import {createServer, Server} from 'net'
import connectionHandler from './connectionHandler/connectionHandler'
import serverHandler from '../serverHandler/serverHandler'
import AgiConfig from './interfaces/agiConfig.interface'
import AgiConfigSchema from './schemas/agiConfig.schema'
import loghandler from 'loghandler'

export class AgiHandler extends serverHandler {
  private server: null | Server = null

  public constructor(protected deps: AgiServerDependencies, private opts: AgiConfig) {
    super(deps)
  }

  public static Factory(opts: AgiConfig) {
    return new this({createServer, connectionHandler, loghandler}, opts)
  }

  public static validateConfig(opts: unknown): opts is AgiConfig {
    const result = AgiConfigSchema.validate(opts, {allowUnknown: true})
    return result.error === undefined
  }

  public static getValidationErrors(opts: unknown) {
    return AgiConfigSchema.validate(opts, {allowUnknown: true}).error
  }

  public init() {
    const opts = this.opts
    const Log = this.GetLogObj(opts.log)
    this.Log = Log

    const connectionHandler = this.deps.connectionHandler

    if (this.server === null) {
      this.server = this.deps.createServer(opts, async connection => {
        Log.debug('new connection is initialized!', {connection})
        const Connection = connectionHandler.Factory({server: this, Log}, connection)
        await opts.handler({Connection, Log})
      })

      this.server.on('error', err => {
        this.Log.err(err)
        this.emit('error', new Error('Internal TCP server error'))
      })

      this.server.on('close', () => {
        this.Log.debug('Connection closed!')
        this.emit('close')
      })

      this.server.listen(opts.port, opts.host, () => {
        this.Log.info(`Fast-Agi script is running and listens to port ${opts.port}!`)
      })

      return this
    }

    const err = new Error('There is already a sever instance initialized.')
    this.Log.emerg(err)
    throw err
  }

  public async close() {
    if (this.server !== null) {
      this.server.close(err => {
        if (err) {
          this.Log.err(err)
          throw err
        }

        return this
      })

      this.server = null
    } else {
      const err = new Error("Server can't be closed, Because there is no sever instance initialized.")
      this.Log.crit(err)
      throw err
    }
  }
}

export default AgiHandler
