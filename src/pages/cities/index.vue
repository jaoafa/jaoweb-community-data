<template>
  <v-container fluid>
    <h2>登録自治体一覧</h2>

    <v-row>
      <v-col cols="6">
        <v-card tile>
          <v-list>
            <v-list-item-group v-model="selectedItem" color="primary">
              <v-list-item v-for="item in items" :key="item.id">
                <v-list-item-avatar>
                  <v-tooltip bottom>
                    <template #activator="{ on }">
                      <v-avatar :size="40" v-on="on">
                        <v-img
                          :src="getMinecraftAvatar(item.owner.uuid)"
                        ></v-img>
                      </v-avatar>
                    </template>
                    <span>{{ item.owner.mcid }}</span>
                  </v-tooltip>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="item.name"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col v-if="getSelectCity() != null" cols="6">
        <h3 class="text-center text-h4">{{ getSelectCity().name }}</h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import City from '~/api/models/city'

export default Vue.extend({
  name: 'CitiesIndexPage',
  data(): {
    selectedItem: string
    items: City[]
  } {
    return {
      selectedItem: '',
      items: [],
    }
  },
  head() {
    return {
      title: '登録自治体一覧',
    }
  },
  created() {
    this.fetch()

    this.$nuxt.$on('fetch-button', this.fetch)
  },
  methods: {
    fetch() {
      this.items = []

      this.$axios.get('/api/cities').then((response: { data: City[] }) => {
        this.items = response.data
      })
    },
    getMinecraftAvatar(uuid: string) {
      if (uuid === null || uuid === 'null') {
        return '/community/jaoafa.png'
      }
      return `https://crafatar.com/avatars/${uuid}?size=40&overlay`
    },
    getSelectCity() {
      return this.items[parseInt(this.selectedItem, 10)]
    },
  },
})
</script>
