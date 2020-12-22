import {TcpNetConnectOpts} from 'net'
import {Config as LogConfig} from 'loghandler'
import LogFunction from '../../../interfaces/logFunction.interface'
import AgiConnectionHandlerFunction from '../connectionHandler/interfaces/agiConnectionHandlerFunction.interface'

export interface AgiConfig extends TcpNetConnectOpts {
  readonly handler: AgiConnectionHandlerFunction
  readonly log?: LogConfig | LogFunction
}

export default AgiConfig
