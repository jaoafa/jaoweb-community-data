<template>
  <v-container fluid>
    <p>
      jao Minecraft Server に関する様々なデータを提供しています。<br />PCでの閲覧を推奨しています。（スマートフォンやタブレットでは正常に表示されない可能性があります）
    </p>
    <p>
      意見や不具合報告は<a
        href="https://github.com/jaoafa/jaoweb-community-data/issues/new/choose"
        >こちら</a
      >から。
    </p>

    <v-card>
      <v-list>
        <v-list-group
          v-for="item in items"
          :key="item.path"
          :value="true"
          :prepend-icon="item.icon"
          no-action
        >
          <template #activator>
            <v-list-item-title v-text="item.name" />
          </template>
          <v-list-item
            v-for="link in item.links"
            :key="link.path"
            nuxt
            :to="link.path"
            :disabled="!isExists(link.path, link.route)"
          >
            <v-list-item-icon>
              <v-icon v-text="link.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="link.name" />
              <v-list-item-subtitle
                v-if="link.description"
                style="white-space: pre-wrap; word-wrap: break-word"
                v-text="link.description"
              />
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'

interface Link {
  path: string
  route?: string
  icon: string
  name: string
  description?: string
}

interface LinkGroup {
  name: string
  icon: string
  links: Link[]
}

export default Vue.extend({
  name: 'IndexPage',
  data(): {
    items: LinkGroup[]
  } {
    return {
      items: [
        {
          name: 'ユーザー',
          icon: 'mdi-account-circle',
          links: [
            {
              path: '/users/limited-verified',
              icon: 'mdi-account-multiple',
              name: 'Limited Verified 対象者一覧',
            },
          ],
        },
        {
          name: '自治体関連',
          icon: 'mdi-home-city',
          links: [
            {
              path: '/cities',
              route: '/cities/:id?',
              icon: 'mdi-city-variant-outline',
              name: '登録自治体一覧',
              description: '運営によって承認され、登録されている自治体の一覧',
            },
          ],
        },
        {
          name: '各種ランキング',
          icon: 'mdi-podium-gold',
          links: [
            {
              path: '/ranking/periodmatch',
              icon: 'mdi-format-letter-matches',
              name: 'ピリオドマッチランキング',
            },
            {
              path: '/ranking/659',
              icon: 'mdi-clipboard-text-clock-outline',
              name: '659ランキング',
            },
          ],
        },
        {
          name: 'その他',
          icon: 'mdi-database-eye',
          links: [
            {
              path: '/other/vcspeaker-params',
              icon: 'mdi-numeric',
              name: 'JDA-VCSpeaker デフォルトパラメータ一覧',
            },
          ],
        },
      ],
    }
  },
  head() {
    return {
      title: 'トップページ',
    }
  },
  methods: {
    isExists(path: string, route: string | undefined): boolean {
      return (
        this.$router.options.routes?.some(
          (page: { path: string }) =>
            page.path === path || (route && page.path === route)
        ) ?? false
      )
    },
  },
})
</script>
