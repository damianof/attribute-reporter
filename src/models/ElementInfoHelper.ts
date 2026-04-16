import type { IElementInfo } from '../models'

export class ElementInfoHelper {
  public static getQualifiedName(el: IElementInfo | undefined): string {
    if (el) {
      if (el.className) {
        const className = el.className
          .trim()
          .replace(/\s{2,}/g, ' ')
          .replace(/\s+/g, '.')
        return `${el.localName}.${className}`
      }

      if ((el.id || '').length > 0) {
        return `${el.localName}#${el.id}`
      }

      return `${el.localName}-noClassNorId`
    }
    return ''
  }
}
