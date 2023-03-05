<template>
  <q-list>
    <q-item v-for="m in menus" :key="`menu-${m.name}`" dense class="q-pl-lg"
            :to="m.route" active-class="bg-primary text-white">
      <q-item-section side style="color: inherit">
        <q-icon :name="m.icon" size="1.1rem"/>
      </q-item-section>

      <q-item-section class="q-py-sm q-pl-sm">
        {{ m.label }}
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const menus = computed(() => [
  {
    label: 'Permissions',
    icon: 'fitbit',
    route: { name: 'perms' },
  },
])
</script>
