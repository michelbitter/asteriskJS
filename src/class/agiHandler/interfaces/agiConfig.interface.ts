import {TcpNetConnectOpts} from 'net'
import {Config as LogConfig} from 'loghandler'
import LogFunction from '../../../interfaces/logFunction.interface'
import AgiConnectionHandlerFunction from './agiConnectionHandlerFunction.interface'

interface AgiConfigDefault {
  readonly handler: AgiConnectionHandlerFunction
  readonly log?: LogConfig | LogFunction
}

export interface AgiConfigTCP extends TcpNetConnectOpts, AgiConfigDefault {
  readonly type: 'tcp'
}

export interface AgiConfigStdIn extends AgiConfigDefault {
  readonly type: 'cli'
}

export type AgiConfig = AgiConfigTCP | AgiConfigStdIn

export default AgiConfig
