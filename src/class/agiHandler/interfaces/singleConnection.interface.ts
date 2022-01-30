import {EventEmitter} from 'events'

export interface SingleConnection extends EventEmitter {
  write(str: Uint8Array | string, encoding?: BufferEncoding, cb?: (err?: Error) => void): boolean
  end(): void
}
