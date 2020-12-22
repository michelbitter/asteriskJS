import * as joi from '@hapi/joi'

export default joi.object().keys({
  allowHalfOpen: joi.boolean().optional(),
  family: joi.string().optional(),
  fd: joi.string().optional(),
  handler: joi.function().required(),
  hints: joi.string().optional(),
  host: joi.string().optional(),
  localAddress: joi.string().optional(),
  localPort: joi.number().integer().optional(),
  log: joi.alternatives().try(joi.func(), joi.object()).optional(),
  lookup: joi.function().optional(),
  port: joi.number().integer().required(),
  readable: joi.boolean().optional(),
  timeout: joi.number().optional(),
  writable: joi.boolean().optional(),
})
