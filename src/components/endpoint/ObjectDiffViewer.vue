<script setup>
defineProps({
  value: {
    type: Object,
    required: true
  },
  basePath: {
    type: String,
    default: ''
  },
  isDiff: {
    type: Function,
    required: true
  }
})
</script>

<template>
  <div class="json">
    <div
      v-for="(val, key) in value"
      :key="key"
      class="row"
      :class="{ diff: isDiff(basePath ? `${basePath}.${key}` : key) }"
    >
      <span class="key">{{ key }}:</span>

      <span v-if="typeof val !== 'object' || val === null" class="value" :class="typeof val">
        {{ val }}
      </span>

      <ObjectDiffViewer
        v-else
        :value="val"
        :base-path="basePath ? `${basePath}.${key}` : key"
        :is-diff="isDiff"
      />
    </div>
  </div>
</template>

<style scoped>
.json {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 13px;
  color: #e6edf3;
}


.row {
  padding: 2px 6px;
  line-height: 1.45;
}


.key {
  color: var(--q-primary);
  font-weight: 500;
}


.value {
  color: #5BA6EFFF;
}


.value:has-text("true") {
  color: #3fb950;
}
.value:has-text("false") {
  color: #f85149;
}


.diff {
  background: rgba(255, 193, 7, 0.22);
  border-left: 4px solid #f2cc60;
}


.json > .row {
  margin-left: 12px;
}

.value.string {
  color: #5BA6EFFF;
}

.value.number {
  color: #d2a8ff;
}

.value.boolean {
  font-weight: 600;
}

.value.undefined,
.value.null {
  color: #8b949e;
  font-style: italic;
}
</style>
