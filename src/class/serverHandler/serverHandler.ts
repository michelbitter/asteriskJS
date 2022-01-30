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
        emerg: (...args: any[]) => log('emerg', ...args),
        alert: (...args: any[]) => log('alert', ...args),
        crit: (...args: any[]) => log('crit', ...args),
        err: (...args: any[]) => log('err', ...args),
        warning: (...args: any[]) => log('warning', ...args),
        notice: (...args: any[]) => log('notice', ...args),
        info: (...args: any[]) => log('info', ...args),
        debug: (...args: any[]) => log('debug', ...args),
      }
    } else if (typeof log === 'object' && 'reporters' in log) {
      return this.deps.loghandler(log)
    } else {
      return this.generateLogObj()
    }
  }
}
