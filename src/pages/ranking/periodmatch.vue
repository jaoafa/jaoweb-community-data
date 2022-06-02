<template>
  <v-container fluid>
    <h2>ピリオドマッチランキング</h2>

    <v-card tile>
      <v-list>
        <v-list-item-group v-model="selectedItem" color="primary">
          <v-list-item v-for="item in items" :key="item.id">
            <v-list-item-avatar>
              {{ item.rank }}
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title v-text="item.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import PeriodMatchResult from '~/api/models/periodmatch-result'

export default Vue.extend({
  name: 'RankingPeriodMatchPage',
  data(): {
    items: PeriodMatchResult[]
  } {
    return {
      items: [],
    }
  },
  head() {
    return {
      title: 'ピリオドマッチランキング',
    }
  },
  created() {
    this.fetch()

    this.$nuxt.$on('fetch-button', this.fetch)
  },
  methods: {
    fetch() {
      this.items = []

      this.$axios
        .get('/api/ranking/periodmatch/')
        .then((response: { data: PeriodMatchResult[] }) => {
          this.items = response.data
        })
    },
    getMinecraftAvatar(uuid: string) {
      if (uuid === null || uuid === 'null') {
        return '/community/jaoafa.png'
      }
      return `https://crafatar.com/avatars/${uuid}?size=40&overlay`
    },
  },
})
</script>
