import DefaultAmiEvent from '../amiEvent.interface'
import ChannelState from '../channelState.interface'

export interface AgentCompleteAmiEvent extends DefaultAmiEvent {
  Event: 'AgentComplete'
  Channel: string
  ChannelState: ChannelState
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
  DestChannel: string
  DestChannelState: string
  DestChannelStateDesc: ChannelState
  DestCallerIDNum: string
  DestCallerIDName: string
  DestConnectedLineNum: string
  DestConnectedLineName: string
  DestLanguage: string
  DestLinkedid: string
  Queue: string
  MemberName: string
  Interface: string
  HoldTime: string
  TalkTime: string
  Reason: 'caller' | 'agent' | 'transfer'
}
