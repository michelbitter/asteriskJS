import DefaultAmiEvent from '../amiEvent.interface'
import Serverity from '../serverity.interface'

export interface UnexpectedAddressAmiEvent extends DefaultAmiEvent {
  Event: 'UnexpectedAddress'
  EventTV: string
  Severity: Serverity
  Service: string
  EventVersion: string
  AccountID: string
  SessionID: string
  LocalAddress: string
  RemoteAddress: string
  ExpectedAddress: string
  Module?: string
  SessionTV?: string
}
