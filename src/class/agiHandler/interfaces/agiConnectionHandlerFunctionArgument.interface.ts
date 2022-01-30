import LogObj from '../../../interfaces/logObj.interface'
import agiConnectionHandler from '../agiConnectionHandler'

export interface AgiConnectionHandlerFunctionArgument {
  Log: LogObj
  Connection: agiConnectionHandler
}

export default AgiConnectionHandlerFunctionArgument
