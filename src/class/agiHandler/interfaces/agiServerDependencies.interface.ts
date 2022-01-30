import AgiConnectionHandler from '../agiConnectionHandler'
import {createServer} from 'net'
import {ServerDependencies} from '../../serverHandler/interfaces/serverDependencies.interface'
import CLIConnection from '../connections/cliConnection.class'

export interface AgiServerDependencies extends ServerDependencies {
  AgiConnectionHandler: typeof AgiConnectionHandler
  connections: {
    cli: typeof CLIConnection
    tcp: typeof createServer
  }
}
