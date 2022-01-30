import {AgiServerDependencies} from './interfaces/agiServerDependencies.interface'
import {createServer} from 'net'
import serverHandler from '../serverHandler/serverHandler'
import AgiConfig from './interfaces/agiConfig.interface'
import AgiConfigSchema from './schemas/agiConfig.schema'
import loghandler from 'loghandler'
import AgiConnectionHandler from './agiConnectionHandler'
import CLIConnection from './connections/cliConnection.class'
import {SingleConnection} from './interfaces/singleConnection.interface'

export class AgiConnectionEstablisher extends serverHandler {
  public constructor(protected deps: AgiServerDependencies, private opts: AgiConfig) {
    super(deps)
  }

  public static Factory(opts: AgiConfig) {
    return new this({connections: {tcp: createServer, cli: CLIConnection}, AgiConnectionHandler, loghandler}, opts)
  }

  public static validateConfig(opts: unknown): opts is AgiConfig {
    const result = AgiConfigSchema.validate(opts, {allowUnknown: true})
    return result.error === undefined
  }

  public static getValidationErrors(opts: unknown) {
    return AgiConfigSchema.validate(opts, {allowUnknown: true}).error
  }

  public async init() {
    const opts = this.opts
    const Log = this.GetLogObj(opts.log)
    this.Log = Log

    if (opts.type === 'cli') {
      const socket: SingleConnection = this.deps.connections.cli.Factory()
      Log.debug('new cli connection is initialized!')
      const Connection = this.deps.AgiConnectionHandler.Factory({Log, server: this}, socket)
      await opts.handler({Connection, Log})
    } else if (opts.type === 'tcp') {
      const server = this.deps.connections.tcp(opts, async connection => {
        Log.debug('new connection is initialized!', {connection})
        const Connection = this.deps.AgiConnectionHandler.Factory({Log, server: this}, connection)
        await opts.handler({Connection, Log})
      })

      server.listen(opts.port, opts.host, () => {
        this.Log.info(`Fast-Agi script is running and listens to port ${opts.port}!`)
      })

      this.on('close', () => {
        server.close(err => {
          if (err) {
            this.Log.err(err)
            throw err
          }
        })
      })
    } else {
      const err = new Error(
        `Couldn't make connection. Connection type is unknown. Please choose between "cli" and "tcp"`,
      )
      this.Log.emerg(err)
      throw err
    }
  }

  public async close() {
    this.emit('close')
  }
}

export default AgiConnectionEstablisher
