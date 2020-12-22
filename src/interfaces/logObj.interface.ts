import LogFunction from './logFunction.interface'

export interface LogObj {
  emerg: LogFunction
  alert: LogFunction
  crit: LogFunction
  err: LogFunction
  warning: LogFunction
  notice: LogFunction
  info: LogFunction
  debug: LogFunction
}

export default LogObj
