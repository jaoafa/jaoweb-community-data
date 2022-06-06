<template>
  <v-container fluid>
    <h2>ピリオドマッチランキング</h2>

    <p class="mb-5">
      PeriodMatch (無印) のデータはこのランキングに含まれていません。
    </p>

    <v-select
      v-model="category"
      label="表示するカテゴリ"
      :items="categories"
      outlined
      prepend-icon="mdi-format-letter-matches"
      @change="fetch()"
    >
      <template #item="{ item }"> {{ item }} 秒 </template>
      <template #selection="{ item }"> {{ item }} 秒 </template>
    </v-select>

    <PeriodMatchPodium
      :first="podium.first"
      :second="podium.second"
      :third="podium.third"
    />

    <v-card tile>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="15"
        :loading="loading"
        class="elevation-1"
      >
        <template #[`item.player.mcid`]="{ item }">
          <v-avatar :size="40" v-on="on">
            <v-img :src="getMinecraftAvatar(item.player.uuid)"></v-img>
          </v-avatar>
          <a :href="'https://users.jaoafa.com/' + item.player.uuid">
            {{ item.player.mcid }}
          </a>
        </template>
        <template #[`item.start_time`]="{ item }">
          {{ formatDate(new Date(item.start_time), 'yyyy/MM/dd HH:mm:ss') }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { DataTableHeader } from 'vuetify'
import PeriodMatchResult, { PeriodMatchPlayer } from '~/api/models/periodmatch'

interface PodiumProp {
  first: PeriodMatchPlayer | null
  second: PeriodMatchPlayer | null
  third: PeriodMatchPlayer | null
}

export default Vue.extend({
  name: 'RankingPeriodMatchPage',
  data(): {
    headers: DataTableHeader[]
    items: PeriodMatchResult[]
    category: number
    categories: number[]
    podium: PodiumProp
    loading: boolean
  } {
    return {
      headers: [
        {
          text: '順位',
          align: 'start',
          sortable: true,
          value: 'rank',
        },
        {
          text: '名前',
          align: 'start',
          sortable: true,
          value: 'player.mcid',
        },
        {
          text: '成功',
          align: 'start',
          sortable: false,
          value: 'success',
        },
        {
          text: '失敗',
          align: 'start',
          sortable: false,
          value: 'failure',
        },
        {
          text: '実施日時',
          align: 'start',
          sortable: false,
          value: 'start_time',
        },
      ],
      items: [],
      category: 60,
      categories: [-1, 0, 1, 10, 20, 30, 60, 100, 300],
      podium: {
        first: null,
        second: null,
        third: null,
      },
      loading: true,
    }
  },
  head() {
    return {
      title: 'ピリオドマッチランキング',
    }
  },
  watch: {
    category() {
      if (this.$route.params.category === this.category.toString()) {
        return
      }
      history.replaceState(
        {},
        '',
        'ranking/periodmatch/' + this.category.toString()
      )
      this.$route.params.category = this.category.toString()
    },
  },
  created() {
    if (this.$route.params.category) {
      this.category =
        this.categories.find(
          (item: number) => item.toString() === this.$route.params.categories
        ) ?? 60
    } else if (typeof history !== 'undefined') {
      history.replaceState(
        {},
        '',
        'ranking/periodmatch/' + this.category.toString()
      )
      this.$route.params.category = this.category.toString()
    }

    this.fetch()

    this.$nuxt.$on('fetch-button', this.fetch)
  },
  methods: {
    fetch() {
      this.items = []

      this.loading = true
      this.$recaptcha.execute('login').then((token: string) => {
        this.$axios
          .get(`/ranking/periodmatch/${this.category}`, {
            headers: {
              'X-RECAPTCHA-TOKEN': token,
            },
          })
          .then((response: { data: PeriodMatchResult[] }) => {
            this.items = response.data

            this.podium = {
              first: this.items.length > 0 ? this.items[0].player : null,
              second: this.items.length > 1 ? this.items[1].player : null,
              third: this.items.length > 2 ? this.items[2].player : null,
            }

            this.loading = false
          })
          .catch((error: any) => {
            this.loading = false
            alert('ピリオドマッチランキングの取得に失敗しました。')
            // eslint-disable-next-line no-console
            console.error(error)
          })
      })
    },
    getMinecraftAvatar(uuid: string) {
      if (uuid === null || uuid === 'null') {
        return this.$router.history.base + '/jaoafa.png'
      }
      return `https://crafatar.com/avatars/${uuid}?size=40&overlay`
    },
    formatDate(date: Date, format: string): string {
      format = format.replace(/yyyy/g, String(date.getFullYear()))
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2))
      format = format.replace(/dd/g, ('0' + date.getDate()).slice(-2))
      format = format.replace(/HH/g, ('0' + date.getHours()).slice(-2))
      format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2))
      format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2))
      format = format.replace(/SSS/g, ('00' + date.getMilliseconds()).slice(-3))
      return format
    },
  },
})
</script>
