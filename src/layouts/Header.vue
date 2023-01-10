<template>
  <q-header bordered class="bg-grey-2 text-primary">
    <q-toolbar class="q-px-sm">
      <div class="q-pr-xs">
        <q-btn flat dense round icon="menu" color="grey-8" @click="$store.commit('app/toggleDrawer')"/>
      </div>

      <q-space/>
    </q-toolbar>
  </q-header>
</template>

<script setup>
</script>
