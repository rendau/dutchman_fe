<template>
  <div>
    <ac-page-toolbar>
      <ac-page-title>
        {{ creating ? 'Create Realm' : 'Edit Realm' }}
      </ac-page-title>
    </ac-page-toolbar>

    <div>
      Hello
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const id = computed(() => route.params.id)
const creating = computed(() => !id.value)
</script>
