export interface DomUtilsInterface {
  isScrollbarVisible(el: HTMLElement): boolean
  getElementWidth(el: HTMLElement, offset: string, defaultWidth: string): string
}

export class DomUtilsModel implements DomUtilsInterface {
  isScrollbarVisible(el: HTMLElement): boolean {
    if (el && el.scrollHeight !== undefined && el.clientHeight !== undefined) {
      return el.scrollHeight > el.clientHeight
    }
    return false
  }

  getElementWidth(el: HTMLElement, offset: string, defaultWidth: string): string {
    if (this.isScrollbarVisible(el)) {
      return `calc(100% - ${offset})` // i.e. if offset is "8px" it will return "calc(100% - 8px)""
    }
    return defaultWidth
  }
}

let _instance!: DomUtilsInterface

export const useDomUtils = (): DomUtilsInterface => {
  if (!_instance) {
    _instance = Object.freeze(new DomUtilsModel())
  }
  return _instance
}
