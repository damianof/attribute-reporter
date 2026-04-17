// duplicating interfaces i need here to avoid duplicated .js files built under public/
interface IAttributeInfo {
  index: number
  name: string
  attributeName: string
  attributeValue: string
  attributeNotSet: boolean
  flashMessage: string
}
interface IElementInfo {
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


let childItems: IAttributeInfo[] = []
const highlightItemClass: string = Object.freeze('ar-highlight-item')

const logger: any = {
  log() {
    //console.log(Array.prototype.slice.call(arguments))
  },
  error() {
    console.log(Array.prototype.slice.call(arguments))
  }
}

/**
 * Saves selected inspected element
 * The function invokes by devtools.js ("chrome.devtools.inspectedWindow.eval")
 * @param el {HTMLElement}
 */
function saveSelectedElement(
  el: any,
  elementIndex: number,
  targetAttributeName: string
): string {
  //logger.log(`content: saveSelectedElement: ${elementIndex}`, el)

  let result: IElementInfo = {
    localName: '',
    className: '',
    id: '',
    name: 'default',
    value: 'default',
    attributeName: '',
    attributeValue: '',
    attributeNotSet: true,
    flashMessage: '',
    reportItems: []
  }

  if (el) {
    //logger.log(`content: saveSelectedElement: if (el) true`)
    if (el.localName) {
      result.localName = el.localName
    }
    if (el.className) {
      // el.className is SVGAnimatedString for SVG elements — coerce to string first
      result.className = String(el.className).trim()
    }
    //logger.log('result after if (el.className)', result)
    if (el.id) {
      result.id = el.id
    }
    //logger.log('result after if (el.id)', result)

    const attributes = el.attributes
    // if (attributes && attributes.id) {
    //   result.name = attributes.id.name
    //   result.value = attributes.id.value
    //   //logger.log('attributes.id.value', attributes.id.value)
    // }
    //logger.log('result after if (attributes)', result)
    result.name = (el.tagName || '').trim()
    if (result.name.length === 0) {
      result.name = 'UNKNOWN'
    }

    // root element target attribute:
    let attr = attributes.getNamedItem(targetAttributeName)
    if (attr) {
      result.attributeName = targetAttributeName
      result.attributeValue = (attr.value || '').trim()
      result.value = result.attributeValue
      result.attributeNotSet = (result.attributeValue || '').trim().length === 0
    }

    // now do child items — collect ALL descendants so the UI can filter freely
    let count = -1
    var items: any = el.querySelectorAll('*')
    //logger.log('items.length', (items || []).length)

    childItems = []
    items.forEach(function (item: any) {
      //logger.log('items.forEach item keys', Object.keys(item))

      let name = (item.tagName || '').trim()
      if (name.length === 0) {
        name = 'UNKNOWN'
      }

      const attr = item.attributes.getNamedItem(targetAttributeName)
      let attributeValue: string = ''
      if (attr) {
        attributeValue = attr.value || ''
      }

      result.reportItems.push({
        index: ++count,
        name: name,
        flashMessage: '',
        attributeName: targetAttributeName,
        attributeValue: attributeValue,
        attributeNotSet: attr === null
      } as IAttributeInfo)

      childItems.push(item)
    })
  }

  const deserialized = '' + JSON.stringify(result)
  return deserialized
}

function highlightChildItem(index: number) {
  //logger.log('highlightChildItem', index, childItems.length)

  clearAllHighlights()

  if (index > -1 && index < childItems.length) {
    let count = -1
    childItems.forEach((domEl: any) => {
      domEl.classList.remove(highlightItemClass)
      if (++count === index) {
        domEl.classList.add(highlightItemClass)
        //logger.log('content: highlighted item', domEl.className)
      }
    })
  }
}

function expandChildItem(_index: number) {
  // No-op: element selection is now handled directly via
  // chrome.devtools.inspectedWindow.eval("inspect($0.querySelectorAll(...)[n])")
  // in ChromeDevToolsHelper, where inspect() is available.
}

function clearAllHighlights() {
  document.body
    .querySelectorAll('*')
    .forEach((el: any) => el.classList.remove(highlightItemClass))
}
