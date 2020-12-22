import agiHandler from './class/agiHandler/agiHandler'
import amiHandler from './class/amiHandler/amiHandler'

export interface HandlerDependencies {
  agiHandler: typeof agiHandler
  amiHandler: typeof amiHandler
}
