import DefaultAmiEvent from '../amiEvent.interface'

export interface UnloadAmiEvent extends DefaultAmiEvent {
  Event: 'Unload'
  Module: string
  Status: string
}
