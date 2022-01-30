import {HandlerDependencies} from './interfaces'
import AgiConnectionEstablisher from './class/agiHandler/agiConnectionEstablisher'
import amiHandler from './class/amiHandler/amiHandler'

export default class {
  public constructor(private deps: HandlerDependencies) {}

  public static Factory() {
    return new this({
      AgiConnectionEstablisher,
      amiHandler,
    })
  }

  public async agi(opts: unknown) {
    if (this.deps.AgiConnectionEstablisher.validateConfig(opts)) {
      const agiHandler = this.deps.AgiConnectionEstablisher.Factory(opts)
      return agiHandler.init()
    } else {
      throw this.deps.AgiConnectionEstablisher.getValidationErrors(opts)
    }
  }

  public async ami(opts: unknown): Promise<amiHandler> {
    if (this.deps.amiHandler.validateConfig(opts)) {
      const amiHandler = this.deps.amiHandler.Factory(opts)
      return await amiHandler.connect()
    } else {
      throw this.deps.amiHandler.getValidationErrors(opts)
    }
  }
}
