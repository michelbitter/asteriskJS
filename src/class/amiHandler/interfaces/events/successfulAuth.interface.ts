import DefaultAmiEvent from '../amiEvent.interface'
import Serverity from '../serverity.interface'

export interface AgentCompleteAmiEvent extends DefaultAmiEvent {
  Event: 'SuccessfulAuth'
  EventTV: string
  Severity: Serverity
  Service: string
  EventVersion: string
  AccountID: string
  SessionID: string
  LocalAddress: string
  RemoteAddress: string
  UsingPassword: string
  Module?: string
  SessionTV?: string
}
