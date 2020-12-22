import * as joi from '@hapi/joi'

const AmiConfigSchema = joi.object().keys({
  allowHalfOpen: joi.boolean().optional(),
  family: joi.string().optional(),
  fd: joi.string().optional(),
  hints: joi.string().optional(),
  host: joi.string().optional(),
  localAddress: joi.string().optional(),
  localPort: joi.number().integer().optional(),
  lookup: joi.function().optional(),
  port: joi.number().integer().required(),
  readable: joi.boolean().optional(),
  timeout: joi.number().optional(),
  writable: joi.boolean().optional(),
  log: joi.alternatives().try(joi.func(), joi.object()).optional(),
  password: joi.string().optional(),
  username: joi.string().optional(),
  retryTimeout: joi.number().optional(),
  maxRetries: joi.number().optional(),
  events: joi.boolean().optional(),
  keepConnected: joi.boolean().optional(),
})

export default AmiConfigSchema
