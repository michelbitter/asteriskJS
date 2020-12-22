import ServerDependencies from '../../serverHandler/interfaces/serverDependencies.interface'
import * as net from 'net'
import {v4 as uuid} from 'uuid'

export interface AMIServerDependencies extends ServerDependencies {
  net: typeof net
  uuid: typeof uuid
}

export default AMIServerDependencies
