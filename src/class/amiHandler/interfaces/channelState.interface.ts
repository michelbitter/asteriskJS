export type ChannelState =
  | 'Down'
  | 'Rsrvd'
  | 'OffHook'
  | 'Dialing'
  | 'Ring'
  | 'Ringing'
  | 'Up'
  | 'Busy'
  | 'Dialing Offhook'
  | 'Pre-ring'
  | 'unknown'

export default ChannelState
