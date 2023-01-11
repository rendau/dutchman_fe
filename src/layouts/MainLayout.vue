<template>
  <q-layout view="LhH LpR LFR" class="app-bg-color relative-position">
    <Header v-if="$store.getters['app/screenSmall']"/>

    <Drawer/>

    <q-page-container>
      <q-page class="q-pt-md q-pr-md q-pb-lg"
              :style="{'padding-left': ($store.getters['app/screenSmall'] ? '15px' : '20px')}">
        <router-view/>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import Header from './Header'
import Drawer from './Drawer'</script>
