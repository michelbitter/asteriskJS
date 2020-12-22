export type LogFunction = (
  msg: string | Error,
  data?: {
    [key: string]: any
  },
  ...args: any[]
) => void

export default LogFunction
