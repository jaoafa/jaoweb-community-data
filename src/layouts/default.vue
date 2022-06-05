<template>
  <v-app>
    <v-app-bar color="gray" fixed app>
      <nuxt-link to="/">
        <AppLogo width="64px" />
      </nuxt-link>
      <nuxt-link to="/" tag="div" style="cursor: pointer" class="mx-3">
        <v-toolbar-title class="text-h4">jMS Data</v-toolbar-title>
      </nuxt-link>
      <v-spacer />
      <v-btn icon elevation="3" class="mx-1" @click="fetchButton()">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'DefaultLayout',
  methods: {
    fetchButton() {
      this.$nuxt.$emit('fetch-button')
    },
  },
})
</script>
