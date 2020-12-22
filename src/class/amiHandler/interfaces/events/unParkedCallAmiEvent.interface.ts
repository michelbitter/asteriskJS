import DefaultAmiEvent from '../amiEvent.interface'
import ChannelState from '../channelState.interface'

export interface UnParkedCallAmiEvent extends DefaultAmiEvent {
  Event: 'UnParkedCall'
  ParkeeChannel: string
  ParkeeChannelState: string
  ParkeeChannelStateDesc: ChannelState
  ParkeeCallerIDNum: string
  ParkeeCallerIDName: string
  ParkeeConnectedLineNum: string
  ParkeeConnectedLineName: string
  ParkeeLanguage: string
  ParkeeAccountCode: string
  ParkeeContext: string
  ParkeeExten: string
  ParkeePriority: string
  ParkeeUniqueid: string
  ParkeeLinkedid: string
  ParkerChannel: string
  ParkerChannelState: string
  ParkerChannelStateDesc: ChannelState
  ParkerCallerIDNum: string
  ParkerCallerIDName: string
  ParkerConnectedLineNum: string
  ParkerConnectedLineName: string
  ParkerLanguage: string
  ParkerAccountCode: string
  ParkerContext: string
  ParkerExten: string
  ParkerPriority: string
  ParkerUniqueid: string
  ParkerLinkedid: string
  ParkerDialString: string
  Parkinglot: string
  ParkingSpace: string
  ParkingTimeout: string
  ParkingDuration: string
  RetrieverChannel: string
  RetrieverChannelState: string
  RetrieverChannelStateDesc: ChannelState
  RetrieverCallerIDNum: string
  RetrieverCallerIDName: string
  RetrieverConnectedLineNum: string
  RetrieverConnectedLineName: string
  RetrieverLanguage: string
  RetrieverAccountCode: string
  RetrieverContext: string
  RetrieverExten: string
  RetrieverPriority: string
  RetrieverUniqueid: string
  RetrieverLinkedid: string
}
