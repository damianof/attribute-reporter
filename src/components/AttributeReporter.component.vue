<script setup lang="ts">
import { computed, ref } from 'vue'
import { IAttributeInfo, IElementInfo, ElementInfoHelper } from '../models/'
import SortButton2 from './elements/SortButton2.vue'
import Domlist from './dom-list/DomList.component.vue'
import packagejson from '../../package.json'

type Props = {
  currentSortBy?: string
  currentSortDirection?: number
  targetAttributeName?: string
  inspectedElements?: IElementInfo[]
  returnAllElements?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  currentSortBy: 'name',
  currentSortDirection: 0,
  targetAttributeName: 'data-testid',
  inspectedElements: () => [],
  returnAllElements: false
})

// version from package.json, to display in the UI and use in tests (e.g. to check if extension is up to date)
const version = `v${packagejson.version}`

const emits = defineEmits<{
  (e: 'gotoElement', n: number): any
  (e: 'targetAttributeNameChanged', newAttributeName: string): any
  (e: 'sortHeaderClick', what: string): any
  (e: 'highlightChildItem', index: number): any
  (e: 'expandChildItem', index: number): any
  (e: 'toggleMissingMode', returnAllElements: boolean): any
}>()

const gotoElement = (n: number) => {
  emits('gotoElement', n)
}

const getQualifiedName = (el: IElementInfo | undefined): string => {
  return ElementInfoHelper.getQualifiedName(el)
}

const totalElements = computed((): number => {
  return (props.inspectedElements || []).length
})

const inspectedElement = computed((): IElementInfo | undefined => {
  const index = totalElements.value
  if (index > 0 && props.inspectedElements[index - 1]) {
    return props.inspectedElements[index - 1]
  }
  return undefined
})

const reportItems = computed((): IAttributeInfo[] => {
  if (inspectedElement.value) {
    return inspectedElement.value.reportItems
  }
  return []
})

const sortedReportItems = computed((): IAttributeInfo[] => {
  const sortDirection = props.currentSortDirection
  if (sortDirection === 0) {
    return reportItems.value
  }

  // copy array to avoid mutating original (we want to preserve the original sorting state in reportItems)
  const items = reportItems.value.concat()
  const sortBy = props.currentSortBy
  return items.sort((itemA: any, itemB: any) => {
    const a: any = itemA[sortBy]
    const b: any = itemB[sortBy]
    if (a > b) {
      return 1 * sortDirection
    } else if (a < b) {
      return -1 * sortDirection
    }
    return 0
  })
})

const attributeNameIsValid = computed((): boolean => {
  return (props.targetAttributeName || '').trim().length > 0
})

let debounceTimeoutId: any

const onTargetAttributeNameKeyUp = (keyboardEvent: any) => {
  const val = keyboardEvent.target.value.trim()
  let newAttributeName: string = (val || '').trim().toLowerCase()

  // emit event to parent component/view to keep this component as dumb as possible
  const debouncedEmit = () => {
    emits('targetAttributeNameChanged', newAttributeName)
  }

  // debounce
  if (debounceTimeoutId !== undefined) {
    clearTimeout(debounceTimeoutId)
    debounceTimeoutId = undefined
  }
  debounceTimeoutId = setTimeout(debouncedEmit, 500)
}

const attributeBadges = ['class', 'id', 'aria-label', 'data-testid']

const onAttributeBadgeClick = (value: string) => {
  emits('targetAttributeNameChanged', value)
}

const filteredReportItems = computed((): IAttributeInfo[] => {
  if (props.returnAllElements) {
    // missing mode: show only elements that lack the attribute
    return sortedReportItems.value.filter((item) => item.attributeNotSet)
  }
  // default: show only elements that have the attribute
  return sortedReportItems.value.filter((item) => !item.attributeNotSet)
})

const onSortClick = (what: string) => {
  emits('sortHeaderClick', what)
}

const onHighlightChildItem = (index: number) => {
  emits('highlightChildItem', index)
}

const onExpandChildItem = (index: number) => {
  emits('expandChildItem', index)
}

const copyAllFlash = ref(false)

const onCopyAll = () => {
  const data = filteredReportItems.value.map((item) => {
    const cssSelector = item.attributeValue
      ? `${item.name}[${item.attributeName}="${item.attributeValue}"]`
      : `${item.name}[${item.attributeName}]`
    const xpathSelector = `$x('//${item.name}[@${item.attributeName}="${item.attributeValue}"]')[0]`
    return {
      element: item.name,
      [item.attributeName]: item.attributeValue,
      cssSelector,
      xpathSelector
    }
  })
  navigator.clipboard.writeText(JSON.stringify(data, null, 2))
  copyAllFlash.value = true
  setTimeout(() => {
    copyAllFlash.value = false
  }, 1500)
}
</script>

<template>
  <div class="attribute-reporter">
    <div class="head">
      <div class="header-and-logo">
        <img src="/icon-32.png" width="24" height="24" title="Logo" />
        <h1>
          Attribute Reporter
          <span>({{ version }})</span>
        </h1>
      </div>

      <div class="attribute-selection">
        <span>Target:</span>
        <span
          :class="`attribute-input ${!attributeNameIsValid ? 'invalid' : ''}`"
          :title="`${!attributeNameIsValid ? 'Invalid name' : 'Attribute Name'}`"
        >
          <input type="text" :value="targetAttributeName" v-on:keyup="onTargetAttributeNameKeyUp" />
          <div class="attribute-badges">
            <button
              v-for="badge in attributeBadges"
              :key="badge"
              type="button"
              class="attribute-badge"
              :class="{ active: targetAttributeName === badge }"
              @click="onAttributeBadgeClick(badge)"
            >
              {{ badge }}
            </button>
            <button
              type="button"
              class="attribute-badge missing-toggle"
              :class="{ active: returnAllElements }"
              title="Show only elements missing this attribute"
              @click="emits('toggleMissingMode', !returnAllElements)"
            >
              ∅ missing
            </button>
          </div>
          <span
            v-if="filteredReportItems.length > 0"
            class="item-count-badge"
            :class="{ flashed: copyAllFlash }"
            title="Copy all results as JSON"
            @click="onCopyAll"
            >{{ copyAllFlash ? '✓' : filteredReportItems.length }}</span
          >
        </span>

        <SortButton2
          v-show="filteredReportItems.length > 0"
          label="Clear sort"
          :sortDirection="0"
          :showDefaultIcon="false"
          @click="onSortClick('none')"
        />
      </div>

      <div class="attribute-selection">
        <div>Element:</div>
        <div class="selected-element-info">
          <div v-if="totalElements > 0">
            <button
              v-for="(n, index) in Array(totalElements - 1).keys()"
              :key="index"
              type="button"
              class="undo-button"
              title="Back to this element"
              @click="gotoElement(n + 1)"
            >
              <span class="short">...</span>
              <span class="full">
                {{ getQualifiedName(inspectedElements[index]) }}
              </span>
            </button>
          </div>
          <span>
            {{
              totalElements > 0
                ? getQualifiedName(inspectedElements[totalElements - 1])
                : 'Select an element in the Elements tab'
            }}
          </span>
        </div>
        <div></div>
      </div>
    </div>

    <Domlist
      v-show="inspectedElements.length > 0"
      :inspectedElement="inspectedElement"
      :items="filteredReportItems"
      :currentSortBy="currentSortBy"
      :currentSortDirection="currentSortDirection"
      :targetAttributeName="targetAttributeName"
      @sortHeaderClick="onSortClick"
      @highlightChildItem="onHighlightChildItem"
      @expandChildItem="onExpandChildItem"
    />
  </div>
</template>
