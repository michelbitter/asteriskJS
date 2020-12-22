import LogObj from '../../../../interfaces/logObj.interface'
import connectionHandler from '../connectionHandler'

export interface AgiConnectionHandlerFunctionArgument {
  Log: LogObj
  Connection: connectionHandler
}

export default AgiConnectionHandlerFunctionArgument
