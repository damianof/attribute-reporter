import { IAttributeInfo } from './IAttributeInfo'

export interface IElementInfo {
  localName: string
  className: string
  id: string
  name: string
  value: string
  attributeName: string
  attributeValue: string
  attributeNotSet: boolean
  flashMessage: string
  reportItems: IAttributeInfo[]
}
