import AmiResponse from './amiResponse.interface'

type basicTypes = string | number | boolean

export interface AmiCommand {
  id: string
  action: string
  opts: {
    [key: string]: basicTypes | basicTypes[] | {[key: string]: basicTypes}
  }
  callback: (data: AmiResponse) => void
}

export default AmiCommand
