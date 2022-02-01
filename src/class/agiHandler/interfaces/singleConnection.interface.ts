import * as Events from 'events'

export interface SingleConnection extends Events.EventEmitter {
  write(str: Uint8Array | string, encoding?: BufferEncoding, cb?: (err?: Error) => void): boolean
  end(): void
}

export default SingleConnection
