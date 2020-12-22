import * as Joi from '@hapi/joi'
import {EventEmitter} from 'events'
import LogFunction from '../../interfaces/logFunction.interface'
import LogObj from '../../interfaces/logObj.interface'
import {Config as LogConfig} from 'loghandler'
import {ServerDependencies} from './interfaces/serverDependencies.interface'

export default class extends EventEmitter {
  protected Log: LogObj

  public constructor(protected deps: ServerDependencies) {
    super()

    this.Log = this.generateLogObj()
  }

  private generateLogObj() {
    return {
      emerg: () => {},
      alert: () => {},
      crit: () => {},
      err: () => {},
      warning: () => {},
      notice: () => {},
      info: () => {},
      debug: () => {},
    }
  }
  protected static getSchemaErrors(schema: Joi.AnySchema, input: unknown) {
    return schema.validate(input)
  }

  protected GetLogObj(log?: LogFunction | LogConfig) {
    if (typeof log === 'function') {
      return {
        emerg: log,
        alert: log,
        crit: log,
        err: log,
        warning: log,
        notice: log,
        info: log,
        debug: log,
      }
    } else if (typeof log === 'object' && 'reporters' in log) {
      return this.deps.loghandler(log)
    } else {
      return this.generateLogObj()
    }
  }
}
