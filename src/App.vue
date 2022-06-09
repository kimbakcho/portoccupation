<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer"/>

        <q-toolbar-title>
          <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar>
          포트 점유율
        </q-toolbar-title>

      </q-toolbar>

    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <q-list separator>
        <q-item clickable to="/occupationAnalytics">
          <q-item-section>
            포트 점유율 분석
          </q-item-section>
        </q-item>
        <q-item clickable to="/portSetting">
          <q-item-section>
            포트 점유율 설정
          </q-item-section>
        </q-item>
      </q-list>

    </q-drawer>


    <q-page-container>
      <router-view/>
    </q-page-container>


  </q-layout>
</template>

<script setup lang="ts">
import {ref} from "vue";

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

</script>

<style>
.mainContainer{
  height: 100%;
}
</style>
