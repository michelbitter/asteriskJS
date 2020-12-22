import DefaultAmiEvent from '../amiEvent.interface'
import ChannelState from '../channelState.interface'

export interface UserAmiEvent extends DefaultAmiEvent {
  Event: 'UserEvent'
  Channel: string
  ChannelState: string
  ChannelStateDesc: ChannelState
  CallerIDNum: string
  CallerIDName: string
  ConnectedLineNum: string
  ConnectedLineName: string
  Language: string
  AccountCode: string
  Context: string
  Exten: string
  Priority: string
  Uniqueid: string
  Linkedid: string
  UserEvent: string
}
