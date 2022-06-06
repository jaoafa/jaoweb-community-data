<template>
  <v-container fluid>
    <h2>JDA-VCSpeaker デフォルトパラメータ一覧</h2>

    <p>
      VCWatcher#0463 の
      <code>/default</code>
      で設定できる「デフォルトパラメーター」の設定一覧です。
    </p>
    <p>デフォルト設定は以下の通りです。</p>
    <ul class="mb-5 d-flex">
      <li class="mr-7">Speaker: <code>HIKARI</code></li>
      <li class="mr-7">Speed: <code>120</code></li>
      <li class="mr-7">Pitch: <code>100</code></li>
      <li class="mr-7">Emotion: 未指定</li>
      <li>EmotionLevel: 未指定</li>
    </ul>

    <v-card tile>
      <v-data-table
        :headers="headers"
        :items="items"
        :items-per-page="15"
        :loading="loading"
        class="elevation-1"
      >
        <template #[`header.listen`]="{}">
          聴く
          <v-btn class="ml-2" icon elevation="5" @click="stopAudio()">
            <v-icon>mdi-stop</v-icon>
          </v-btn>
        </template>
        <template #[`item.user`]="{ item }">
          <span v-if="item.user">
            <v-avatar :size="40">
              <v-img :src="getDiscordAvatar(item.user)"></v-img>
            </v-avatar>
            {{ item.user.user.username }}#{{ item.user.user.discriminator }}
          </span>
          <span v-else>
            <v-avatar :size="40"></v-avatar>
            ?????
          </span>
        </template>
        <template #[`item.listen`]="{ item }">
          <v-btn icon elevation="5" @click="listenSpeakText(item)">
            <v-icon>mdi-volume-high</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { DataTableHeader } from 'vuetify'
import { DiscordUser } from '~/api/models/discord-users'
import { DefaultParam } from '~/api/models/jda-vcspeaker-result'
import getDiscordUsers from '~/lib/getDiscordUsers'

interface Item {
  user: DiscordUser | null
  emotion: string
  speaker: string
  emotionLevel: string
  pitch: number
  speed: number
}

export default Vue.extend({
  name: 'OtherVcSpeakerParamsPage',
  data(): {
    headers: DataTableHeader[]
    items: Item[]
    loading: boolean
    audio: HTMLAudioElement | null
  } {
    return {
      headers: [
        {
          text: 'ユーザー',
          align: 'start',
          sortable: true,
          value: 'user',
        },
        {
          text: 'Speaker',
          align: 'start',
          sortable: true,
          value: 'speaker',
        },
        {
          text: 'Speed',
          align: 'start',
          sortable: false,
          value: 'speed',
        },
        {
          text: 'Pitch',
          align: 'start',
          sortable: false,
          value: 'pitch',
        },
        {
          text: 'Emotion',
          align: 'start',
          sortable: false,
          value: 'emotion',
        },
        {
          text: 'EmotionLevel',
          align: 'start',
          sortable: false,
          value: 'emotionLevel',
        },
        {
          text: '聴く',
          align: 'end',
          sortable: false,
          value: 'listen',
        },
      ],
      items: [],
      loading: true,
      audio: null,
    }
  },
  head() {
    return {
      title: 'JDA-VCSpeaker デフォルトパラメータ一覧',
    }
  },
  created() {
    this.fetch()

    this.$nuxt.$on('fetch-button', this.fetch)
  },
  methods: {
    fetch() {
      this.items = []

      this.loading = true
      this.$recaptcha.execute('login').then((token: string) => {
        this.$axios
          .get(`/other/jda-vcspeaker/default-param`, {
            headers: {
              'X-RECAPTCHA-TOKEN': token,
            },
          })
          .then(async (response: { data: DefaultParam[] }) => {
            const result = response.data

            const discordUsers = await getDiscordUsers(
              this.$recaptcha,
              this.$axios
            )
            this.items = result.map((item: DefaultParam) => {
              const user =
                discordUsers.find(
                  (u: DiscordUser) => u.user.id === item.userId.toString()
                ) ?? null
              return {
                user,
                emotion: item.emotion,
                speaker: item.speaker,
                emotionLevel: item.emotionLevel,
                pitch: item.pitch,
                speed: item.speed,
              }
            })

            this.loading = false
          })
          .catch((error: any) => {
            this.loading = false
            alert('デフォルトパラメータ一覧の取得に失敗しました。')
            // eslint-disable-next-line no-console
            console.error(error)
          })
      })
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
    getDiscordAvatar(user: DiscordUser): string {
      return `https://cdn.discordapp.com/avatars/${user.user.id}/${user.user.avatar}.png`
    },
    listenSpeakText(item: Item) {
      this.stopAudio()
      this.$recaptcha.execute('login').then((token: string) => {
        this.$axios
          .get(`/other/jda-vcspeaker/voicetext`, {
            headers: {
              'X-RECAPTCHA-TOKEN': token,
            },
            params: {
              text: item.user
                ? item.user.user.username +
                  '#' +
                  item.user.user.discriminator +
                  'が設定しています。'
                : 'だれかがわかりませんが設定しています。',
              speaker: item.speaker.toLowerCase(),
              speed: item.speed,
              pitch: item.pitch,
              emotion: item.emotion ? item.emotion.toLowerCase() : undefined,
              emotionLevel:
                item.emotion && item.emotionLevel
                  ? this.getEmotionLevelId(item.emotionLevel)
                  : undefined,
            },
            responseType: 'arraybuffer',
          })
          .then((response: { data: BlobPart }) => {
            this.loading = false
            const blob = new Blob([response.data], {
              type: 'audio/wav',
            })
            const url = URL.createObjectURL(blob)
            this.audio = new Audio(url)
            this.audio.play()
          })
          .catch((error: any) => {
            this.loading = false
            alert('デフォルトパラメータ一覧の取得に失敗しました。')
            // eslint-disable-next-line no-console
            console.error(error)
          })
      })
    },
    getEmotionLevelId(emotion: string): number {
      switch (emotion) {
        case 'LOW':
          return 1
        case 'NORMAL':
          return 2
        case 'HIGH':
          return 3
        case 'SUPER':
          return 4
        default:
          return 0
      }
    },
    stopAudio() {
      if (this.audio) {
        this.audio.pause()
        this.audio = null
      }
    },
  },
})
</script>
