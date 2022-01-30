import {AgiConnectionHandlerFunctionArgument} from './agiConnectionHandlerFunctionArgument.interface'

export type AgiConnectionHandlerFunction = (system: AgiConnectionHandlerFunctionArgument) => Promise<void>

export default AgiConnectionHandlerFunction
