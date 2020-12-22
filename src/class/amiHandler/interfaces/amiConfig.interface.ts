import {TcpSocketConnectOpts} from 'net'
import {Config as LogConfig} from 'loghandler'
import LogFunction from '../../../interfaces/logFunction.interface'

export interface AmiConfig extends TcpSocketConnectOpts {
  readonly username?: string
  readonly password?: string
  readonly events?: boolean
  readonly log?: LogConfig | LogFunction
  readonly retryTimeout?: number
  readonly maxRetries?: number
  readonly keepConnected?: boolean
}

export default AmiConfig
