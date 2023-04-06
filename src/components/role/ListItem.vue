<template>
  <tr class="cursor-pointer" :class="{'text-grey-6': data.is_fetched}">
    <td class="text-no-wrap text-center">
      {{ $u.lGetAttr($store.state.application.list, data.app_id, 'data.name') }}
    </td>

    <td class="text-no-wrap text-center">
      {{ data.code }}
    </td>

    <td class="text-no-wrap">
      {{ data.dsc }}
    </td>

    <td class="text-no-wrap text-center">
      {{ data.is_fetched ? 'Yes' : '' }}
    </td>
  </tr>
</template>

<script setup>
defineProps({
  data: { type: Object, required: true },
})
</script>
