<script setup lang="ts">
import { onMounted } from 'vue'
import AttributeReporter from './components/AttributeReporter.component.vue'
import { useStore } from './store'
//import { logger } from '@/store/ChromeDevtoolsHelper'

const store = useStore()

const targetAttributeName = store.computedGetters.targetAttributeName
const lastSortBy = store.computedGetters.lastSortBy
const lastSortDirection = store.computedGetters.lastSortDirection
const inspectedElements = store.computedGetters.inspectedElements
const returnAllElements = store.computedGetters.returnAllElements

const onTargetAttributeNameChanged = async (newAttributeName: string) => {
  // dispatch action to store
  await store.actions.targetAttributeNameChanged({
    targetAttributeName: newAttributeName,
    elementIndex: inspectedElements.value.length
  })
}

const onHighlightChildItem = async (index: number) => {
  // dispatch action to store
  await store.actions.highlightChildItem(index)
}

const onExpandChildItem = async (index: number) => {
  // dispatch action to store
  await store.actions.expandChildItem(index)
}

const onMouseLeave = async () => {
  // remove all highlights (passing -1 for the index will make it execure only clearAllHighlights)
  await store.actions.highlightChildItem(-1)
}

const gotoElement = async (devToolsNodeIndex: number) => {
  // dispatch action to store
  await store.actions.undo(devToolsNodeIndex)
}

const onSortHeaderClick = async (what: string) => {
  // dispatch action to store
  await store.actions.updateSortByAndDirection(what)
}

const onToggleMissingMode = async (returnAllElements: boolean) => {
  await store.actions.toggleMissingMode(returnAllElements)
}

onMounted(async () => {
  // when the entire chrome dev tools is closed, cleanup
  window.onbeforeunload = () => {
    store.actions.resetItems()
  }

  // fire this on mounted so shows a list when first shown
  await onTargetAttributeNameChanged(targetAttributeName.value)
})
</script>

<template>
  <div class="app-wrapper" @mouseleave="onMouseLeave">
    <AttributeReporter
      :targetAttributeName="targetAttributeName"
      :inspectedElements="inspectedElements"
      :currentSortBy="lastSortBy"
      :currentSortDirection="lastSortDirection"
      :returnAllElements="returnAllElements"
      @gotoElement="gotoElement"
      @targetAttributeNameChanged="onTargetAttributeNameChanged"
      @highlightChildItem="onHighlightChildItem"
      @expandChildItem="onExpandChildItem"
      @sortHeaderClick="onSortHeaderClick"
      @toggleMissingMode="onToggleMissingMode"
    />
  </div>
</template>

<style lang="css">
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

.app-container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.app-container .attribute-reporter {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.app-container .attribute-reporter .gap-2 {
  gap: 0.25rem;
}

.app-container .app-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.app-container .attribute-reporter .head {
  padding: 5px;
}

.app-container .attribute-reporter .head .header-and-logo {
  display: flex;
  align-items: center;
}

.app-container .attribute-reporter .head .header-and-logo img {
  margin-right: 5px;
}

.app-container .attribute-reporter .head .header-and-logo h1 {
  font-size: 22px;
  margin: 0;
}

.app-container .attribute-reporter .head .header-and-logo h1 span {
  font-size: 10px;
}

.app-container .attribute-reporter a {
  color: #42b983;
}

.app-container .attribute-reporter .report-header {
  padding: 5px;
}

.app-container .attribute-reporter .report-filter {
  padding: 5px;
}

.app-container .attribute-reporter .report-filter .report-filter-item {
  display: grid;
  grid-template-columns: 100px auto;
}

.app-container .attribute-reporter .attribute-selection {
  display: grid;
  grid-template-columns: 100px auto 100px;
  align-items: center;
  margin-top: 5px;
}

.app-container .attribute-reporter .attribute-selection .attribute-input {
  display: flex;
  gap: 0.25rem;
  align-items: center;
}

/* .app-container .attribute-reporter .attribute-selection .attribute-input *:not(:first-child) {
  margin-left: 0.25rem;
} */

.app-container .attribute-reporter .attribute-selection .attribute-input.invalid input {
  outline: 0;
  border: solid 2px red;
}
.app-container .attribute-reporter .attribute-selection .attribute-input input {
  padding: 0.25rem 0.5rem;
}

.app-container .attribute-reporter .attribute-selection .attribute-input .attribute-badges {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.app-container .attribute-reporter .attribute-selection .attribute-input .attribute-badge {
  cursor: pointer;
  border: 1px solid #aaa;
  font-size: 10px;
  padding: 0.5rem;
  border-radius: 0.15rem;
  background: #f0f0f0;
  color: #555;
  white-space: nowrap;
  font-weight: bold;
  min-height: 0.5rem;
}

.app-container .attribute-reporter .attribute-selection .attribute-input .attribute-badge:hover {
  background: #ddd;
  border-color: #888;
  color: #222;
}

.app-container .attribute-reporter .attribute-selection .attribute-input .attribute-badge.active {
  background: #0ea5e9;
  border-color: #006898;
  color: #fff;
}

.app-container
  .attribute-reporter
  .attribute-selection
  .attribute-input
  .attribute-badge.missing-toggle {
  border: solid 1px #c2410c;
}

.app-container
  .attribute-reporter
  .attribute-selection
  .attribute-input
  .attribute-badge.missing-toggle.active {
  background: #f97316;
  border-color: #c2410c;
  color: #fff;
}

/* element-type filter row */
.app-container .attribute-reporter .attribute-selection.element-type-filter .attribute-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
}

/* .app-container .attribute-reporter .attribute-selection.element-type-filter .attribute-badges *:not(:first-child) {
  margin-left: 0.25rem;
} */

.app-container .attribute-reporter .attribute-selection.element-type-filter .attribute-badge {
  cursor: pointer;
  border: 1px solid #aaa;
  font-size: 10px;
  padding: 0.5rem;
  border-radius: 0.15rem;
  background: #f0f0f0;
  color: #555;
  white-space: nowrap;
  font-weight: bold;
  min-height: 0.5rem;
}

.app-container .attribute-reporter .attribute-selection.element-type-filter .attribute-badge:hover {
  background: #ddd;
  border-color: #888;
  color: #222;
}

.app-container
  .attribute-reporter
  .attribute-selection.element-type-filter
  .attribute-badge.active {
  background: #7c3aed;
  border-color: #5b21b6;
  color: #fff;
}

.app-container .attribute-reporter .attribute-selection .attribute-input .item-count-badge {
  font-size: 10px;
  padding: 0.5rem;
  border-radius: 0.15rem;
  background: white !important;
  color: #006898;
  border: solid 2px #006898;
  white-space: nowrap;
  font-weight: bold;
  min-height: 0.5rem;
  cursor: pointer;
  transition:
    background 0.2s,
    color 0.2s,
    border-color 0.2s;
}

.app-container .attribute-reporter .attribute-selection .attribute-input .item-count-badge:hover {
  background: #e6f4fb !important;
}

.app-container .attribute-reporter .attribute-selection .attribute-input .item-count-badge.flashed {
  background: #42b983 !important;
  border-color: #42b983;
  color: #fff;
}

.app-container
  .attribute-reporter
  .attribute-selection
  .attribute-input
  .item-count-badge.csv-badge {
  color: #166534;
  border-color: #16a34a;
  margin-left: 0.25rem;
}

.app-container
  .attribute-reporter
  .attribute-selection
  .attribute-input
  .item-count-badge.csv-badge:hover {
  background: #dcfce7 !important;
}

.app-container .attribute-reporter .report-list .empty-state {
  padding: 8px 5px;
  color: #888;
  font-size: 0.8rem;
  font-style: italic;
}

.app-container .attribute-reporter .report-list .empty-state code {
  background: #f0f0f0;
  border-radius: 3px;
  padding: 1px 4px;
  font-style: normal;
  color: #555;
}

.app-container .attribute-reporter .attribute-selection .selected-element-info {
  display: flow-root;
}

.app-container .attribute-reporter .attribute-selection .selected-element-info .undo-button {
  cursor: pointer;
  max-width: 220px;
  margin-right: 5px;
  transition: max-width 0.5s;
  max-width: 30px;
}

.app-container
  .attribute-reporter
  .attribute-selection
  .selected-element-info
  .undo-button
  > .full {
  display: none;
}

.app-container .attribute-reporter .attribute-selection .selected-element-info .undo-button:hover {
  max-width: 220px;
}

.app-container
  .attribute-reporter
  .attribute-selection
  .selected-element-info
  .undo-button:hover
  > .short {
  display: none;
}

.app-container
  .attribute-reporter
  .attribute-selection
  .selected-element-info
  .undo-button:hover
  > .full {
  display: block;
  max-width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-container .attribute-reporter .report-list {
  outline: solid 0 gray;
  background: #fff;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.app-container .attribute-reporter .report-list > .list-header > .sort {
  cursor: pointer;
}

.app-container .attribute-reporter .report-list > .list-content {
  overflow-x: hidden;
  overflow-y: auto;
}

.app-container .attribute-reporter .report-list > .list-content:not(.root-element) {
  flex: 1;
  min-height: 0;
  scrollbar-gutter: stable;
}

.app-container .attribute-reporter .report-list > .list-content .list-item {
  cursor: pointer;
  outline: solid 1px green;
}

.app-container .attribute-reporter .report-list > .list-content .list-item:hover {
  background-color: black;
}

.app-container .attribute-reporter .report-list > .list-content .list-item:hover span {
  color: white;
}

.app-container .attribute-reporter .report-list > .list-content .list-item.attributeNotSet {
  outline: solid 1px rgba(255, 0, 0, 0.5);
}

.app-container .attribute-reporter .report-list > .list-content .list-item.emptyValue {
  outline: solid 1px rgba(249, 115, 22, 0.6);
}

.app-container
  .attribute-reporter
  .report-list
  > .list-content
  .list-item.emptyValue
  span.attribute-value {
  color: #c2410c;
}

.app-container .attribute-reporter .report-list > .list-content .list-item.duplicateValue {
  outline: solid 1px rgba(234, 179, 8, 0.8);
}

.app-container
  .attribute-reporter
  .report-list
  > .list-content
  .list-item.duplicateValue
  span.attribute-value {
  color: #854d0e;
}

.app-container
  .attribute-reporter
  .report-list
  > .list-content
  .list-item.attributeNotSet
  span.attribute-value {
  color: red;
}

.app-container .attribute-reporter .report-list > .list-content .list-item.copied-to-clipboard {
  transition: background-color 0.25s ease-in-out;
  background-color: #33f;
}

.app-container
  .attribute-reporter
  .report-list
  > .list-content
  .list-item.copied-to-clipboard
  span.attribute-value
  i.clipboard {
  display: inline;
}

.app-container
  .attribute-reporter
  .report-list
  > .list-content
  .list-item.copied-to-clipboard:hover {
  background-color: #33f;
}

.app-container .attribute-reporter .report-list > .list-content .list-item span {
  color: black;
}

.app-container .attribute-reporter .report-list > .list-content .list-item .value-to-copy {
  display: none;
}

.app-container .attribute-reporter .report-list > .list-header .header-attribute-action {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.app-container .attribute-reporter .report-list > .list-content .list-item .attribute-action {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.app-container .attribute-reporter .report-list > .list-content .list-item .attribute-value {
  color: green;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 3px;
}

.app-container
  .attribute-reporter
  .report-list
  > .list-content
  .list-item
  .attribute-value
  .state-indicator {
  font-size: 9px;
  flex-shrink: 0;
}

.app-container
  .attribute-reporter
  .report-list
  > .list-content
  .list-item
  .attribute-value
  .attribute-value-text.placeholder {
  font-style: italic;
  opacity: 0.6;
}

.app-container
  .attribute-reporter
  .report-list
  > .list-content
  .list-item
  .attribute-value
  i.clipboard {
  display: none;
  font-size: 16px;
  color: #eee;
}

.app-container .attribute-reporter .report-list > .list-header {
  padding: 5px 10px 5px 5px;
}

.app-container .attribute-reporter .report-list > .list-content,
.app-container .attribute-reporter .report-list > .list-content .list-item {
  padding: 5px;
}

.app-container .attribute-reporter .report-list > .list-header,
.app-container .attribute-reporter .report-list > .list-content .list-item {
  display: grid;
  grid-gap: 3px;
  align-items: center;
  margin-bottom: 7px;
}

.app-container .attribute-reporter .report-list > .list-content.root-element .list-item {
  outline-width: 2px !important;
  outline-offset: -1px;
}

.app-container .attribute-reporter .report-list > .list-header {
  grid-template-columns: 60px 100px 70px auto 100px 100px 100px 100px;
}

.app-container .attribute-reporter .report-list > .list-content .list-item {
  grid-template-columns: 60px 100px auto 100px 100px 100px 100px;
}
</style>
