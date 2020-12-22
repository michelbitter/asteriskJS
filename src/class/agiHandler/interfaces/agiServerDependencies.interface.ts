import connectionHandler from '../connectionHandler/connectionHandler'
import {createServer} from 'net'
import {ServerDependencies} from '../../serverHandler/interfaces/serverDependencies.interface'

export interface AgiServerDependencies extends ServerDependencies {
  createServer: typeof createServer
  connectionHandler: typeof connectionHandler
}
