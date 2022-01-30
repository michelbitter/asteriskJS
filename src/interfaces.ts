import AgiConnectionEstablisher from './class/agiHandler/agiConnectionEstablisher'
import amiHandler from './class/amiHandler/amiHandler'

export interface HandlerDependencies {
  AgiConnectionEstablisher: typeof AgiConnectionEstablisher
  amiHandler: typeof amiHandler
}
