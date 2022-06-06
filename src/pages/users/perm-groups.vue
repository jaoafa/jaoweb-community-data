<template>
  <v-container fluid>
    <h2>権限グループ別プレイヤーリスト</h2>

    <p></p>

    <v-select
      v-model="group"
      label="表示する権限グループ"
      :items="groups"
      outlined
      item-text="group"
      item-value="displayName"
      prepend-icon="mdi-account-group"
      return-object
      @change="fetchPlayers()"
    >
      <template #item="{ item }"> {{ item.displayName }} </template>
      <template #selection="{ item }"> {{ item.displayName }} </template>
    </v-select>

    <v-card tile>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="50"
        :loading="loading"
        class="elevation-1"
      >
        <template #[`item.player`]="{ item }">
          <v-avatar :size="40" v-on="on">
            <v-img :src="getMinecraftAvatar(item.uuid)"></v-img>
          </v-avatar>
          <a :href="'https://users.jaoafa.com/' + item.uuid">
            {{ item.player }}
          </a>
        </template>
        <template #[`item.expire_at`]="{ item }">
          {{ formatDate(new Date(item.expire_at), 'yyyy/MM/dd HH:mm:ss') }}
        </template>
        <template #[`item.updated_at`]="{ item }">
          {{ formatDate(new Date(item.updated_at), 'yyyy/MM/dd HH:mm:ss') }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { DataTableHeader } from 'vuetify'
import PermissionGroup, { PermissionPlayer } from '~/api/models/PermissionGroup'

export default Vue.extend({
  name: 'PermissionGroupPage',
  data(): {
    headers: DataTableHeader[]
    items: PermissionPlayer[]
    group: PermissionGroup | null
    groups: PermissionGroup[]
    loading: boolean
  } {
    return {
      headers: [],
      items: [],
      group: null,
      groups: [],
      loading: true,
    }
  },
  head() {
    return {
      title: '権限グループ別プレイヤーリスト',
    }
  },
  created() {
    this.fetchGroups()

    this.$nuxt.$on('fetch-button', this.fetchGroups)
  },
  methods: {
    fetchGroups() {
      this.groups = []

      this.loading = true
      this.$recaptcha.execute('login').then((token: string) => {
        this.$axios
          .get(`/users/perm-groups`, {
            headers: {
              'X-RECAPTCHA-TOKEN': token,
            },
          })
          .then((response: { data: PermissionGroup[] }) => {
            this.groups = response.data

            this.loading = false

            if (this.groups.length > 0) {
              this.group = this.groups[0]
              this.fetchPlayers()
            }
          })
          .catch((error: any) => {
            this.loading = false
            alert('権限グループリストの取得に失敗しました。')
            // eslint-disable-next-line no-console
            console.error(error)
          })
      })
    },
    fetchPlayers() {
      if (!this.group) {
        return
      }
      this.items = []

      this.loading = true
      this.$recaptcha.execute('login').then((token: string) => {
        this.$axios
          .get(`/users/perm-groups/${this.group?.key}`, {
            headers: {
              'X-RECAPTCHA-TOKEN': token,
            },
          })
          .then((response: { data: PermissionPlayer[] }) => {
            this.items = response.data

            this.loading = false
            this.setHeaders()
          })
          .catch((error: any) => {
            this.loading = false
            alert('プレイヤーリストの取得に失敗しました。')
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
    setHeaders() {
      this.headers = this.items.some((i) => i.expire_at != null)
        ? [
            {
              text: 'プレイヤー名',
              align: 'start',
              sortable: true,
              value: 'player',
            },
            {
              text: '解除予定日時',
              align: 'start',
              sortable: true,
              value: 'expire_at',
            },
            {
              text: 'データ更新日',
              align: 'start',
              sortable: true,
              value: 'updated_at',
            },
          ]
        : [
            {
              text: 'プレイヤー名',
              align: 'start',
              sortable: true,
              value: 'player',
            },
            {
              text: 'データ更新日',
              align: 'start',
              sortable: true,
              value: 'updated_at',
            },
          ]
    },
  },
})
</script>
