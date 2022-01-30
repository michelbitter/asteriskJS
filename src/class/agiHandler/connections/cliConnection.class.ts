import {EventEmitter} from 'events'
import {SingleConnection} from '../interfaces/singleConnection.interface'
import * as process from 'process'

export interface Dependencies {
  process: typeof process
}

export class CLIConnection extends EventEmitter implements SingleConnection {
  public constructor(private deps: Dependencies) {
    super()

    this.deps.process.stdin
      .on('close', hadError => this.emit('close', hadError))
      .on('connect', () => this.emit('connect'))
      .on('data', data => this.emit('data', data))
      .on('drain', () => this.emit('drain'))
      .on('end', () => this.emit('end'))
      .on('error', error => this.emit('error', error))
      .on('lookup', error => this.emit('lookup', error))
      .on('ready', () => this.emit('ready'))
      .on('timeout', () => this.emit('timeout'))
  }

  public static Factory() {
    return new this({process})
  }

  public write(
    buffer: string | Uint8Array,
    encoding?: BufferEncoding,
    cb?: ((err?: Error | undefined) => void) | undefined,
  ) {
    return this.deps.process.stdout.write(buffer, encoding, cb)
  }

  public end() {
    return this.deps.process.stdout.end()
  }
}

export default CLIConnection
