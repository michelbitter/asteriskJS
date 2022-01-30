import {EventEmitter} from 'events'
import {Log} from 'loghandler'
import {v4} from 'uuid'

export interface ContextHandlerDependencies extends ContextHandlerSys {
  uuid: typeof v4
}

export interface ContextHandlerSys {
  Log: Log
  server: EventEmitter
}

export enum Status {
  busy = 'busy',
  init = 'init',
  ready = 'ready',
  waiting = 'waiting',
}

export interface AGIAnswerObject {
  code: number
  result: string
  value: string | undefined
}

export enum CommandStatus {
  'queued' = 'queued',
  'active' = 'active',
  'error' = 'error',
}

export interface CommandObject {
  id: symbol
  msg: string
  callback: (response: any) => void
  timestamp: Date
}

export type CommandQueue = CommandObject[]

export type validationFNC<T extends AGIAnswerObject> = (response: AGIAnswerObject) => response is T
