<script setup lang="ts">
import { computed } from 'vue'

const emits = defineEmits<{
  (e: 'click', sortDirection: number): any
}>()

type Props = {
  label?: string
  sortDirection?: number
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Label',
  sortDirection: 0
})

const cssClass = computed((): string => {
  return `button-sort ${props.sortDirection !== 0 ? 'sorting' : ''}`
})

const iconName = computed((): string => {
  return props.sortDirection > 0 ? 'arrow_upward' : props.sortDirection < 0 ? 'arrow_downward' : ''
})

const onClick = () => {
  emits('click', props.sortDirection)
}
</script>

<template>
  <div role="button" :class="cssClass" @click="onClick">
    <span v-if="label">{{ label }}</span>
    <i v-if="iconName" class="material-icons">{{ iconName }}</i>
  </div>
</template>
