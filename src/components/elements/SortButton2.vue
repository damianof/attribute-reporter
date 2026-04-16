<script setup lang="ts">
import { computed } from 'vue'

const emits = defineEmits<{
  (e: 'click', sortDirection: number): any
}>()

type Props = {
  label?: string
  sortDirection?: number
  showDefaultIcon?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  label: 'Label',
  sortDirection: 0,
  showDefaultIcon: false
})

const cssClass = computed((): string => {
  return `button-sort ${props.sortDirection !== 0 ? 'sorting' : ''}`
})

// const iconName = computed((): string => {
//   return props.sortDirection > 0
//     ? 'arrow_upward'
//     : props.sortDirection < 0
//     ? 'arrow_downward'
//     : ''
// })

const showIcon = computed((): boolean => {
  return props.showDefaultIcon || Number(props.sortDirection) !== 0
})

const onClick = () => {
  emits('click', props.sortDirection)
}
</script>

<template>
  <div role="button" :class="cssClass" @click="onClick">
    <span v-if="label">{{ label }}</span>
    <svg
      v-if="showIcon"
      class="sort-icon"
      viewBox="0 0 21600 21600"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xml:space="preserve"
      xmlns:serif="http://www.serif.com/"
    >
      <g v-if="Number(sortDirection) === 0">
        <g transform="matrix(1.54135,0,0,1.40364,3729.15,-1507.97)">
          <g transform="matrix(7124.34,0,0,7124.34,4910.67,7699.97)">
            <path
              d="M0.33,-0.092L0.157,-0.092L0.131,0L0.03,0L0.231,-0.7L0.249,-0.7L0.459,0L0.358,0L0.33,-0.092ZM0.302,-0.182L0.24,-0.385L0.183,-0.182L0.302,-0.182Z"
            />
          </g>
          <g transform="matrix(7124.34,0,0,7124.34,4996.16,14824.3)">
            <path
              d="M0.189,-0.1L0.415,-0.1L0.415,0L0.04,0L0.276,-0.6L0.05,-0.6L0.05,-0.7L0.425,-0.7L0.189,-0.1Z"
            />
          </g>
        </g>
        <path
          d="M6111.91,7127.51L4959.91,7127.51L6651.91,3240L8343.92,7127.51L7191.91,7127.51L7191.91,14400L8343.92,14400L6651.91,18287.5L4959.91,14400L6111.91,14400L6111.91,7127.51Z"
        />
      </g>
      <g v-if="Number(sortDirection) > 0">
        <g transform="matrix(1.54135,0,0,1.40364,3729.15,-1507.97)">
          <g transform="matrix(7124.34,0,0,7124.34,4910.67,7699.97)">
            <path
              d="M0.33,-0.092L0.157,-0.092L0.131,0L0.03,0L0.231,-0.7L0.249,-0.7L0.459,0L0.358,0L0.33,-0.092ZM0.302,-0.182L0.24,-0.385L0.183,-0.182L0.302,-0.182Z"
            />
          </g>
          <g transform="matrix(7124.34,0,0,7124.34,4996.16,14824.3)">
            <path
              d="M0.189,-0.1L0.415,-0.1L0.415,0L0.04,0L0.276,-0.6L0.05,-0.6L0.05,-0.7L0.425,-0.7L0.189,-0.1Z"
            />
          </g>
        </g>
        <g transform="matrix(498.808,1.22173e-13,-2.71898e-13,1110.11,4147.79,-572.886)">
          <path d="M4,7L1.5,7L5,3.5L8.5,7L6,7L6,16.99L4,16.99L4,7Z" />
        </g>
      </g>
      <g v-if="Number(sortDirection) < 0">
        <g transform="matrix(1.54135,0,0,1.40364,3729.15,-1507.97)">
          <g transform="matrix(7124.34,0,0,7124.34,4996.16,7699.97)">
            <path
              d="M0.189,-0.1L0.415,-0.1L0.415,0L0.04,0L0.276,-0.6L0.05,-0.6L0.05,-0.7L0.425,-0.7L0.189,-0.1Z"
            />
          </g>
          <g transform="matrix(7124.34,0,0,7124.34,4910.67,14824.3)">
            <path
              d="M0.33,-0.092L0.157,-0.092L0.131,0L0.03,0L0.231,-0.7L0.249,-0.7L0.459,0L0.358,0L0.33,-0.092ZM0.302,-0.182L0.24,-0.385L0.183,-0.182L0.302,-0.182Z"
            />
          </g>
        </g>
        <g transform="matrix(-498.808,-1.83259e-13,4.07847e-13,-1110.11,9135.87,22172.9)">
          <path d="M4,7L1.5,7L5,3.5L8.5,7L6,7L6,16.99L4,16.99L4,7Z" />
        </g>
      </g>
    </svg>
  </div>
</template>

<style lang="css">
.button-sort {
  cursor: pointer;
  display: flex;
  align-items: center;
}
.button-sort.sorting {
  color: blue;
}
.button-sort.sorting .sort-icon {
  fill: blue;
}
.button-sort .sort-icon {
  width: 24px;
  height: 24px;
  min-width: 24px;
  min-height: 24px;
  border-radius: 3px;
  fill: #bbb;
}
</style>
