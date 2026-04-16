<script setup lang="ts">
import { ref, reactive, computed, nextTick, onBeforeUpdate } from 'vue'
import { IElementInfo, IAttributeInfo, useDomUtils } from '../../models/'
import SortButton2 from '../elements/SortButton2.vue'
import DomListItemComponent from './DomListItem.component.vue'

const domUtils = useDomUtils()

type Props = {
  currentSortBy?: string
  currentSortDirection?: number
  targetAttributeName?: string
  inspectedElement?: IElementInfo
  items?: IAttributeInfo[]
}

const props = withDefaults(defineProps<Props>(), {
  currentSortBy: 'name',
  currentSortDirection: 0,
  targetAttributeName: 'class',
  inspectedElement: () => {
    return {} as any
  },
  items: () => []
})

const emits = defineEmits<{
  (e: 'sortHeaderClick', what: string): any
  (e: 'highlightChildItem', index: number): any
  (e: 'expandChildItem', index: number): any
}>()

const refScrollList = ref(null)

const state = reactive({
  rootElementWidth: '100%',
  rootElementDefaultWidth: 'calc(100% - 10px)',
  rootElementDefaultOffset: '24px'
})

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

const updateRootElementWidth = (el: any) => {
  state.rootElementWidth = domUtils.getElementWidth(
    el,
    state.rootElementDefaultOffset,
    state.rootElementDefaultWidth
  )
}

const onSortClick = (what: string) => {
  emits('sortHeaderClick', what)
}

const onHighlightChildItem = (index: number) => {
  emits('highlightChildItem', index)
}

const onExpandChildItem = (index: number) => {
  emits('expandChildItem', index)
}

onBeforeUpdate(() => {
  // update scroll container width
  nextTick(() => {
    const elScrollList: any = refScrollList.value
    updateRootElementWidth(elScrollList)
  })
})
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
      <span> Attribute </span>
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
      <span>CSS</span>
      <span>Value</span>
      <span>XPath</span>
    </div>

    <!-- root element -->
    <div
      class="list-content root-element"
      ref="refRootElement"
      :style="`width: ${state.rootElementWidth}`"
    >
      <DomListItemComponent
        :item="<any>inspectedElement"
        @highlightChildItem="onHighlightChildItem"
        @expandChildItem="onExpandChildItem"
      ></DomListItemComponent>
    </div>

    <!-- list (scrolling) -->
    <div class="list-content" ref="refScrollList">
      <DomListItemComponent
        v-for="(item, index) in items"
        :key="index"
        :item="item"
        @highlightChildItem="onHighlightChildItem"
        @expandChildItem="onExpandChildItem"
      ></DomListItemComponent>
      <div v-if="items.length === 0" class="empty-state">
        No child elements with <code>[{{ targetAttributeName }}]</code> found.
      </div>
    </div>
  </div>
</template>
