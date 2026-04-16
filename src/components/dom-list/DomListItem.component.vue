<script setup lang="ts">
import { computed } from 'vue'
import { IAttributeInfo } from '../../models/'

type Props = {
  item: IAttributeInfo
}

const props = withDefaults(defineProps<Props>(), {
  item: () => {
    return {
      index: -1,
      name: 'unknown',
      attributeName: 'unknown',
      attributeValue: 'unknown',
      attributeNotSet: false,
      flashMessage: ''
    }
  }
})

const emits = defineEmits<{
  (e: 'highlightChildItem', index: number): any
  (e: 'expandChildItem', index: number): any
}>()

const cssClass = computed((): string => {
  const { attributeNotSet, flashMessage } = props.item
  return `${attributeNotSet ? 'attributeNotSet' : ''} ${flashMessage ? 'copied-to-clipboard' : ''}`
})

const tooltipText = computed((): string => {
  const { index, name, attributeName } = props.item
  return `Index: ${index} Name: ${name} Attribute: ${attributeName}`
})

const cssSelector = computed(() => {
  const { name, attributeName, attributeValue } = props.item
  if (!attributeValue) return `${name}[${attributeName}]`
  return `${name}[${attributeName}="${attributeValue}"]`
})

const xpathExpression = computed(() => {
  const item = props.item
  return `$x('//${item.name}[@${item.attributeName}="${item.attributeValue}"]')[0]`
})

const copyToClipboard = (text: string) => {
  try {
    // cannout use navigator.clipboard.writeText as cannot get clipboard-write permission in devtools panel/tab
    // so using old trick to create domelement
    const input = document.createElement('input')
    document.body.appendChild(input)
    input.value = text
    input.focus()
    input.select()
    document.execCommand('copy')
    input.remove()
  } catch (err) {
    console.log('copyToClipboard: error', err)
  }
}

const onMouseOverItem = (_item: IAttributeInfo) => {
  const index = Number(props.item.index)
  // emit event to parent component/view to keep this component as dumb as possible
  emits('highlightChildItem', index)
}

const onItemClick = (_event: Event, item: IAttributeInfo, action: string) => {
  const { name, attributeName, attributeValue } = props.item
  if (action === 'copy-value') {
    copyToClipboard(attributeValue)
    item.flashMessage = ' (value copied to clipboard)'
  } else if (action === 'copy-css-selector') {
    copyToClipboard(cssSelector.value)
    item.flashMessage = ' (CSS selector copied)'
  } else if (action === 'copy-xpath') {
    copyToClipboard(`$x('//${name}[@${attributeName}="${attributeValue}"]')[0]`)
    item.flashMessage = ' (xpath expression copied to clipboard)'
  } else if (action === 'expand-item') {
    emits('expandChildItem', item.index)
  }

  setTimeout(() => {
    item.flashMessage = ''
  }, 500)
}
</script>

<template>
  <div
    class="list-item"
    :title="tooltipText"
    :class="cssClass"
    @mouseover="onMouseOverItem(item)"
    @click="onItemClick($event, item, 'expand-item')"
  >
    <span class="attribute-name">{{ item.name }}</span>
    <span class="attribute-name">{{ item.attributeName }}</span>
    <span class="attribute-value">
      <span class="attribute-value-text">{{ item.attributeValue }}</span>
      <span v-if="item.flashMessage">{{ item.flashMessage }}</span>
    </span>
    <!-- <span class="attribute-action">
      <i
        class="material-icons expand"
        title="Expand"
        @click="onItemClick($event, item, 'expand-item')"
        >expand</i
      >
    </span> -->
    <span></span>
    <span class="attribute-action">
      <i
        class="material-icons clipboard"
        title="Copy value to clipboard"
        @click.prevent.stop="onItemClick($event, item, 'copy-value')"
      >
        content_copy
      </i>
      <span class="value-to-copy">{{ item.attributeValue }}</span>
    </span>
    <span class="attribute-action">
      <i
        class="material-icons clipboard"
        title="Copy CSS selector to clipboard"
        @click.prevent.stop="onItemClick($event, item, 'copy-css-selector')"
      >
        content_copy
      </i>
      <span class="value-to-copy">{{ cssSelector }}</span>
    </span>
    <span class="attribute-action">
      <i
        class="material-icons clipboard"
        title="Copy xpath expression to clipboard"
        @click.prevent.stop="onItemClick($event, item, 'copy-xpath')"
      >
        content_copy
      </i>
      <span class="value-to-copy">
        {{ xpathExpression }}
      </span>
    </span>
  </div>
</template>
