import DefaultAmiEvent from '../amiEvent.interface'
import ChannelState from '../channelState.interface'

export interface VarSetAmiEvent extends DefaultAmiEvent {
  Event: 'VarSet'
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
  Variable: string
  Value: string
}
