<script setup lang="ts">
import { computed } from 'vue'
import { IElementInfo, IAttributeInfo } from '../../models/'
import SortButton2 from '../elements/SortButton2.vue'
import DomListItemComponent from './DomListItem.component.vue'

type Props = {
  currentSortBy?: string
  currentSortDirection?: number
  targetAttributeName?: string
  inspectedElement?: IElementInfo
  items?: IAttributeInfo[]
  duplicateValues?: Set<string>
}

const props = withDefaults(defineProps<Props>(), {
  currentSortBy: 'name',
  currentSortDirection: 0,
  targetAttributeName: 'class',
  inspectedElement: () => {
    return {} as any
  },
  items: () => [],
  duplicateValues: () => new Set()
})

const emits = defineEmits<{
  (e: 'sortHeaderClick', what: string): any
  (e: 'highlightChildItem', index: number): any
  (e: 'expandChildItem', index: number): any
}>()

const nameSortDirection = computed((): number => {
  if (props.currentSortBy === 'name') {
    return props.currentSortDirection
  }
  return 0
})

const attributeValueSortDirection = computed((): number => {
  if (props.currentSortBy === 'attributeValue') {
    return props.currentSortDirection
  }
  return 0
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
</script>

<template>
  <div class="report-list">
    <!-- header -->
    <div class="list-header">
      <SortButton2
        label="Elem"
        :sortDirection="nameSortDirection"
        :showDefaultIcon="true"
        @click="onSortClick('name')"
      />
      <span>Attribute</span>
      <SortButton2
        label="Value"
        :sortDirection="attributeValueSortDirection"
        :showDefaultIcon="true"
        @click="onSortClick('attributeValue')"
      />
      <span>
        <!--Filter-->
      </span>
      <span><!--Expand--></span>
      <span class="header-attribute-action">CSS</span>
      <span class="header-attribute-action">Value</span>
      <span class="header-attribute-action">XPath</span>
    </div>

    <!-- root element -->
    <div class="list-content root-element">
      <DomListItemComponent
        :item="<any>inspectedElement"
        @highlightChildItem="onHighlightChildItem"
        @expandChildItem="onExpandChildItem"
      ></DomListItemComponent>
    </div>

    <!-- list (scrolling) -->
    <div class="list-content">
      <DomListItemComponent
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        :isDuplicate="duplicateValues.has(item.attributeValue) && !!item.attributeValue"
        @highlightChildItem="onHighlightChildItem"
        @expandChildItem="onExpandChildItem"
      ></DomListItemComponent>
      <div v-if="items.length === 0" class="empty-state">
        No child elements with <code>[{{ targetAttributeName }}]</code> found.
      </div>
    </div>
  </div>
</template>
