import { reactive, computed } from 'vue'
import { IElementInfo } from '../models'
import { chromeDevToolsHelper, logger } from './ChromeDevToolsHelper'

// to use only when developing
let testElements: IElementInfo[] = [
  {
    localName: 'div',
    className: 'test  some  class  ',
    id: '',
    name: 'default',
    value: 'default',
    attributeName: '',
    attributeValue: '',
    attributeNotSet: true,
    flashMessage: '',
    reportItems: [
      {
        index: 0,
        name: 'h1',
        flashMessage: '',
        attributeName: 'id',
        attributeValue: 'blah',
        attributeNotSet: false
      },
      {
        index: 1,
        name: 'div',
        flashMessage: '',
        attributeName: 'id',
        attributeValue: 'asdasdasd',
        attributeNotSet: false
      },
      {
        index: 2,
        name: 'p',
        flashMessage: '',
        attributeName: 'id',
        attributeValue: 'dfdf',
        attributeNotSet: false
      },
      {
        index: 3,
        name: 'img',
        flashMessage: '',
        attributeName: 'id',
        attributeValue: 'poasdasdasd',
        attributeNotSet: false
      },
      {
        index: 4,
        name: 'section',
        flashMessage: '',
        attributeName: 'id',
        attributeValue: 'kjg-df-sdf',
        attributeNotSet: false
      },
      {
        index: 5,
        name: 'p',
        flashMessage: '',
        attributeName: 'id',
        attributeValue: 'sdf-gg-fff',
        attributeNotSet: false
      }
    ]
  },
]

const debug = true
let initialInspectedElements: IElementInfo[] = []
if (debug) {
  initialInspectedElements = testElements // during development only, for CSS tweaks etc, use testElements
}

const state = reactive({
  targetAttributeName: 'class',
  lastSortDirection: 0,
  lastSortBy: 'name',
  lastHighlightedIndex: -1,
  lastExpandedIndex: -1,
  inspectedElements: initialInspectedElements
})

const mutations = {
  targetAttributeNameChanged: (newName: string) => {
    state.targetAttributeName = (newName || '').trim()

    if (state.targetAttributeName.length === 0) {
      state.inspectedElements = []
    } else {
      // when target attribute name changes, we need to clear the history
      if (state.targetAttributeName.length > 0 && state.inspectedElements.length > 1) {
        state.inspectedElements = [state.inspectedElements[0]]
      }
    }
  },

  updateReportItems: (elementInfo: IElementInfo) => {
    //state.inspectedElements.push(elementInfo)
    // Turning off undo history for the timebeing as of version 1.1
    state.inspectedElements = [elementInfo]
  },

  resetItems: () => {
    state.inspectedElements = []
  },

  highlightChildItem: (index: number) => {
    state.lastHighlightedIndex = index
  },

  expandChildItem: (index: number) => {
    state.lastExpandedIndex = index
  }
}

const actions = {
  targetAttributeNameChanged: async (args: {
    targetAttributeName: string
    elementIndex: number
  }) => {
    const { targetAttributeName, elementIndex } = args
    mutations.targetAttributeNameChanged(targetAttributeName)

    // chrome.devtools: update observed attribute name, then updated inspectedElements
    chromeDevToolsHelper.onSelectionChanged(elementIndex, targetAttributeName).then(
      (parsed: any) => {
        mutations.updateReportItems(parsed)
        return true
      },
      () => {}
    )
  },

  updateReportItems: (elementInfo: IElementInfo) => {
    mutations.updateReportItems(elementInfo)
  },

  updateSortByAndDirection: async (what: string) => {
    const currentSortBy = state.lastSortBy
    let currentSortDirection = state.lastSortDirection

    if (what === 'none') {
      state.lastSortDirection = 0
    } else if (what === currentSortBy) {
      state.lastSortBy = what
      // if clicking on the same item, reverse sort direction
      state.lastSortDirection = currentSortDirection > 0 ? -1 : 1
    } else {
      state.lastSortBy = what
    }
    return true
  },

  resetItems: async () => {
    // chrome.devtools: clear all highlights then reset items in store
    chromeDevToolsHelper.clearAllHighlights().then(
      () => {
        mutations.resetItems()
        return true
      },
      () => {}
    )
  },

  highlightChildItem: async (index: number) => {
    // chrome.devtools: highlightChildItem
    chromeDevToolsHelper.highlightChildItem(index).then(
      () => {
        // remember last highlighted index
        mutations.highlightChildItem(index)
        return true
      },
      () => {}
    )
  },

  expandChildItem: async (index: number) => {
    // chrome.devtools: expandChildItem
    chromeDevToolsHelper.expandChildItem(index, state.targetAttributeName).then(
      () => {
        // remember last expanded index
        mutations.expandChildItem(index)
        return true
      },
      () => {}
    )
  },

  undo: async (index: number) => {
    // chrome.devtools: undo
    chromeDevToolsHelper.undo(index).then(
      () => {
        state.inspectedElements.splice(index)
        return true
      },
      () => {}
    )
  }
}

const computedGetters = {
  targetAttributeName: computed((): string => {
    // return value from store
    return state.targetAttributeName
  }),

  lastSortBy: computed((): string => {
    // return value from store
    return state.lastSortBy
  }),

  lastSortDirection: computed((): number => {
    // return value from store
    return state.lastSortDirection
  }),

  inspectedElements: computed((): IElementInfo[] => {
    // return value from store
    return state.inspectedElements
  })
}

const _store = {
  actions,
  computedGetters
}

type IStore = typeof _store

export const useStore = (): IStore => {
  return _store
}

///////////////////////////// chrome.devtools //////////////////////////
chromeDevToolsHelper.init({
  panelName: 'Attribute Reporter',
  getTargetAttributeName: () => {
    return state.targetAttributeName
  },
  onShown: () => {
    // on panel shown, update the panel data through store
    actions.targetAttributeNameChanged({
      targetAttributeName: state.targetAttributeName,
      elementIndex: state.inspectedElements.length
    })
  },
  onHidden: () => {
    actions.resetItems()
  },
  getElementIndex: (): number => {
    return state.inspectedElements.length
  },
  onModelUpdated: (parsed: any) => {
    if (parsed) {
      // sort by lastSortBy and lastSortDirection
      actions.updateReportItems(parsed)
    } else {
      logger.log('WARNING: onModelUpdated: parsed is not defined')
    }
  }
})
///////////////////////////// chrome.devtools //////////////////////////
