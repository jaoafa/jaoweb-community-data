<template>
  <v-container fluid>
    <h2>659ランキング</h2>

    <p class="mb-5">
      jMS Gamers Club #659
      で行われている、特定時刻にどれだけ差無く投稿できるかを競っているアレのランキングです。
    </p>

    <v-select
      v-model="category"
      label="表示するカテゴリ"
      :items="categories"
      outlined
      item-text="name"
      item-value="categoryId"
      prepend-icon="mdi-format-letter-matches"
      return-object
      @change="fetchRecords()"
    >
      <template #item="{ item }"> {{ item.name }} ({{ item.base }}) </template>
      <template #selection="{ item }">
        {{ item.name }} ({{ item.base }})
      </template>
    </v-select>

    <v-card tile>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="15"
        :loading="loading"
        class="elevation-1"
      >
        <template #[`item.user`]="{ item }">
          {{ item.user.userName }}#{{ item.user.discriminator }}
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
import {
  Api659CategoryResponse,
  Api659RecordResponse,
} from '~/api/models/659-api-result'
import { DiscordUser } from '~/api/models/discord-users'

export default Vue.extend({
  name: 'Ranking659Page',
  data(): {
    headers: DataTableHeader[]
    items: Api659RecordResponse[]
    category: Api659CategoryResponse | null
    categories: Api659CategoryResponse[]
    loading: boolean
  } {
    return {
      headers: [
        {
          text: '順位',
          align: 'center',
          sortable: true,
          value: 'rank',
        },
        {
          text: 'ユーザー',
          align: 'center',
          sortable: true,
          value: 'user',
        },
        {
          text: '時間差 (ms)',
          align: 'center',
          sortable: true,
          value: 'diff',
        },
        {
          text: '投稿日',
          align: 'center',
          sortable: true,
          value: 'postedAt',
        },
      ],
      items: [],
      category: null,
      categories: [],
      loading: true,
    }
  },
  head() {
    return {
      title: '659ランキング',
    }
  },
  created() {
    this.fetchCategory()

    this.$nuxt.$on('fetch-button', this.fetchCategory)
    this.$nuxt.$on('fetch-button', this.fetchRecords)
  },
  methods: {
    fetchCategory() {
      this.categories = []

      this.loading = true
      this.$recaptcha.execute('login').then((token: string) => {
        this.$axios
          .get(`/ranking/659/category`, {
            headers: {
              'X-RECAPTCHA-TOKEN': token,
            },
          })
          .then((response: { data: Api659CategoryResponse[] }) => {
            this.categories = response.data

            this.loading = false

            if (this.$route.params.category) {
              this.category =
                this.categories.find(
                  (item: Api659CategoryResponse) =>
                    item.categoryId.toString() === this.$route.params.category
                ) ?? null
              this.fetchRecords()
            } else if (this.categories.length > 0) {
              this.category = this.categories[0]
              this.fetchRecords()
            }
          })
          .catch((error: any) => {
            this.loading = false
            alert('ピリオドマッチカテゴリの取得に失敗しました。')
            // eslint-disable-next-line no-console
            console.error(error)
          })
      })
    },
    fetchRecords() {
      if (!this.category) {
        return
      }

      if (this.$route.params.category !== this.category.categoryId.toString()) {
        history.replaceState(
          {},
          '',
          'ranking/659/' + this.category.categoryId.toString()
        )
        this.$route.params.category = this.category.categoryId.toString()
      }

      this.items = []

      this.loading = true
      this.$recaptcha.execute('login').then((token: string) => {
        this.$axios
          .get(`/ranking/659/records/${this.category?.categoryId}`, {
            headers: {
              'X-RECAPTCHA-TOKEN': token,
            },
          })
          .then((response: { data: Api659RecordResponse[] }) => {
            this.items = response.data

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
    getDiscordAvatar(user: DiscordUser): string {
      return `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png`
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
