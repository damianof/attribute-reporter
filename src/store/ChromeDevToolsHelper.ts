export interface IChromeDevToolsHelper {
  onSelectionChanged(elementIndex: number, targetAttributeName: string): Promise<any>
  highlightChildItem(index: number): Promise<boolean>
  clearAllHighlights(): Promise<boolean>
  expandChildItem(index: number, attributeName: string): Promise<boolean>
  undo(devToolsNodeIndex: number): Promise<boolean>
}

const privateChrome: any = (window as any).chrome
export const logger: any = {
  log(_msg: string) {
    // // TODO: uncomment this code only while debugging/developing. Uncomment before packing extension for deployment
    // if (
    //   privateChrome &&
    //   privateChrome.devtools &&
    //   privateChrome.devtools.inspectedWindow
    // ) {
    //   privateChrome.devtools.inspectedWindow.eval(
    //     `console.log("%c ChromeDevtoolsHelper: ${msg}", "background: cyan;");`
    //   )
    // } else {
    //   console.log('ChromeDevtoolsHelper:', msg)
    // }
  }
}

/**
 * @name contentScriptMethodNames
 * @description
 * The name of the methods defined within the src-content-scripts/content-scripts.ts file.
 * These are the method invoked here to be executed within the content script context (inspected page)
 */
const contentScriptMethodNames = Object.freeze({
  saveSelectedElement: 'saveSelectedElement',
  highlightChildItem: 'highlightChildItem',
  clearAllHighlights: 'clearAllHighlights',
  expandChildItem: 'expandChildItem'
})

export interface IChromeDevToolsHelperOptions {
  panelName: string
  getTargetAttributeName: () => string
  onShown: () => void
  onHidden: () => void
  onModelUpdated: (parsed: any) => void
  getElementIndex: () => number
}

/**
 * chrome.devtools helper
 */
export class ChromeDevToolsHelper implements IChromeDevToolsHelper {
  // private readonly privateChrome: any = (window as any).chrome
  // private options!: IChromeDevToolsHelperOptions

  init(options: IChromeDevToolsHelperOptions) {
    // this.options = options
    const self = this
    if (privateChrome && privateChrome.devtools) {
      const panels = privateChrome.devtools.panels
      //panels.create(options.panelName, '32.png', 'index.html', (sidebar: any) => {
      panels.elements.createSidebarPane(options.panelName, (sidebar: any) => {
        //currentSidebar = sidebar
        // logger.log('createSidebarPane callback')

        //sidebar.setObject(panelState, 'roottitle', stateCallback)
        sidebar.setPage('index.html')
        sidebar.setHeight('100%')

        panels.elements.onSelectionChanged.addListener(() => {
          const elementIndex = options.getElementIndex()
          const targetAttributeName = options.getTargetAttributeName()
          self.clearAllHighlights().then(
            () => {
              self.onSelectionChanged(elementIndex, targetAttributeName).then(
                (parsed: any) => {
                  options.onModelUpdated(parsed)
                },
                () => {}
              )
            },
            () => {}
          )
        })

        // add handlers for Panel shown/hidden
        sidebar.onShown.addListener(() => {
          const elementIndex = options.getElementIndex()
          const targetAttributeName = options.getTargetAttributeName()
          self.clearAllHighlights().then(
            () => {
              self.onSelectionChanged(elementIndex, targetAttributeName).then(
                (parsed: any) => {
                  options.onModelUpdated(parsed)
                },
                () => {}
              )
            },
            () => {}
          )
        })

        sidebar.onHidden.addListener(() => {
          self.clearAllHighlights().then(() => {
            options.onHidden()
          })
        })
      })
    }
  }

  onSelectionChanged(elementIndex: number, targetAttributeName: string): Promise<any> {
    return new Promise<any>((resolve: any, reject: any) => {
      if (privateChrome) {
        const invokedMethodExpression = `${contentScriptMethodNames.saveSelectedElement}($0, ${elementIndex}, '${targetAttributeName}');`

        privateChrome.devtools.inspectedWindow.eval(
          invokedMethodExpression,
          { useContentScriptContext: true },
          (result: string, exceptionInfo: any) => {
            if (exceptionInfo) {
              // Most likely cause: content script not yet injected (tab was open before extension loaded).
              // User can resolve by reloading the inspected page.
              reject(exceptionInfo)
            } else if (typeof result === 'string' && result) {
              resolve(JSON.parse(result))
            } else {
              reject(false)
            }
          }
        )
      } else {
        reject()
      }
    })
  }

  highlightChildItem(index: number): Promise<boolean> {
    return new Promise<boolean>((resolve: any, reject: any) => {
      if (privateChrome && privateChrome.devtools) {
        const invokedMethodExpression = `${contentScriptMethodNames.highlightChildItem}(${index});`
        // logger.log(
        //   `highlightChildItem: invokedMethodExpression ${invokedMethodExpression}`
        // )

        privateChrome.devtools.inspectedWindow.eval(
          invokedMethodExpression,
          {
            useContentScriptContext: true // run the code in the content-script
          },
          () => {
            resolve(true)
          }
        )
      } else {
        reject(false)
      }
    })
  }

  expandChildItem(index: number, attributeName: string): Promise<boolean> {
    return new Promise<boolean>((resolve: any, reject: any) => {
      if (privateChrome && privateChrome.devtools) {
        // $0 is the currently selected element in the Elements panel.
        // querySelectorAll order matches the childItems order built in saveSelectedElement.
        // inspect() is a DevTools console API — available here without useContentScriptContext.
        // Append "; void 0" so the eval result is undefined (a primitive),
        // preventing "Object reference chain is too long" from the protocol
        // trying to serialize the DOM element back to the extension.
        privateChrome.devtools.inspectedWindow.eval(
          `inspect($0.querySelectorAll('[${attributeName}]')[${index}]); void 0`,
          (_result: any, isException: any) => {
            if (isException) {
              console.error(
                'expandChildItem failed:',
                isException?.value ?? JSON.stringify(isException)
              )
              reject(false)
            } else {
              resolve(true)
            }
          }
        )
      } else {
        reject(false)
      }
    })
  }

  undo(devToolsNodeIndex: number): Promise<boolean> {
    return new Promise<boolean>((resolve: any, reject: any) => {
      if (privateChrome && privateChrome.devtools) {
        const nodeExpression = `$${devToolsNodeIndex}` // i.e. $0 or $1 etc
        privateChrome.devtools.inspectedWindow.eval(
          `inspect(${nodeExpression}); void 0`,
          (_result: any, isException: any) => {
            if (isException) {
              try {
                console.error('undo failed:', isException?.value ?? JSON.stringify(isException))
              } catch (e) {
                console.error('undo failed with an exception that could not be stringified:', e)
              }
              reject(false)
            } else {
              resolve(true)
            }
          }
        )
      } else {
        reject(false)
      }
    })
  }

  clearAllHighlights(): Promise<boolean> {
    return new Promise<boolean>((resolve: any, reject: any) => {
      if (privateChrome && privateChrome.devtools) {
        const invokedMethodExpression = `clearAllHighlights();`
        // logger.log(
        //   `clearAllHighlights: invokedMethodExpression ${invokedMethodExpression}`
        // )

        privateChrome.devtools.inspectedWindow.eval(
          invokedMethodExpression,
          {
            useContentScriptContext: true // run the code in the content-script
          },
          () => {
            resolve(true)
          }
        )
      } else {
        reject(false)
      }
    })
  }
}

export const chromeDevToolsHelper = new ChromeDevToolsHelper()
