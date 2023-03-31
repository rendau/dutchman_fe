<template>
  <tr class="cursor-pointer" :class="{'text-grey-6': !data.data.active}">
    <td class="text-right text-no-wrap text-weight-light min-width">
      <div style="min-width: 56px">
        {{ data.data.method }}
      </div>
    </td>

    <td class="text-no-wrap text-subtitle2">
      <div class="q-pl-sm">
        /{{ data.data.path }}
      </div>
    </td>

    <td class="text-center min-width">
      <div class="row no-wrap items-center justify-end q-gutter-sm">
        <span v-if="data.data.ip_validation?.enabled" class="text-caption text-bold text-blue-grey-4">IP</span>

        <q-icon v-if="data.data.jwt_validation?.enabled" name="lock" color="blue-grey-4" size=".85rem"/>
      </div>
    </td>
  </tr>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, required: true },
})
</script>
