<template>
  <v-container fluid>
    <h2>登録自治体一覧</h2>

    <v-row>
      <v-col cols="4">
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

      <v-col v-if="getSelectCity() != null" cols="8">
        <v-row>
          <v-col cols="12">
            <h2 class="text-h4 city-owner-text">
              <span class="city-border" />
              <span class="city-title">{{ getSelectCity().name }}</span>
              <span class="city-by">by</span>
              <a
                class="city-owner"
                :href="`https://users.jaoafa.com/${getSelectCity().owner.uuid}`"
              >
                <v-avatar class="city-avatar">
                  <v-img
                    :src="getMinecraftAvatar(getSelectCity().owner.uuid)"
                  ></v-img>
                </v-avatar>
                {{ getSelectCity().owner.mcid }}
              </a>
            </h2>
          </v-col>
        </v-row>

        <v-row class="mt-5">
          <v-col cols="6">
            <v-text-field
              readonly
              :value="getSelectCity().regionName"
              prepend-inner-icon="mdi-pound"
              append-icon="mdi-clipboard-outline"
              solo
              @click:append="copyRegionName()"
            ></v-text-field>

            <h3>自治体の概要</h3>
            <v-textarea solo readonly :value="getSelectCity().summary" />

            <h3>自治体名称の由来</h3>
            <v-textarea solo readonly :value="getSelectCity().nameOrigin" />
          </v-col>
          <v-col cols="6">
            <v-img src="assets/dummy.png" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <ChangeLogTimeline :city="getSelectCity()" />
          </v-col>
        </v-row>
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
  watch: {
    selectedItem() {
      const city = this.getSelectCity()
      if (city == null) {
        return
      }
      if (this.$route.params.id === city.id.toString()) {
        return
      }
      history.replaceState({}, '', 'cities/' + city.id.toString())
    },
  },
  created() {
    this.fetch()

    this.$nuxt.$on('fetch-button', this.fetch)
  },
  methods: {
    fetch() {
      this.items = []

      this.$axios.get('/cities').then((response: { data: City[] }) => {
        this.items = response.data

        if (this.$route.params.id) {
          this.selectedItem = this.items
            .findIndex(
              (item: City) => item.id.toString() === this.$route.params.id
            )
            .toString()
        }
      })
    },
    getMinecraftAvatar(uuid: string) {
      if (uuid === null || uuid === 'null') {
        return '/community/jaoafa.png'
      }
      return `https://crafatar.com/avatars/${uuid}?size=40&overlay`
    },
    getSelectCity() {
      if (this.selectedItem === '') {
        return null
      }
      const i = parseInt(this.selectedItem, 10)
      if (this.items.length <= i) {
        return null
      }
      return this.items[i]
    },
    copyRegionName() {
      const city = this.getSelectCity()
      if (city == null) {
        return
      }
      const text = city.regionName
      this.$copyText(text)
        .then(() => alert(`「${text}」をコピーしました。`))
        .catch(() => alert(`「${text}」をコピーできませんでした。`))
    },
  },
})
</script>

<style>
.city-border {
  border: 4px solid #ffb41d;
  border-radius: 1em;
}

.city-title {
  margin-left: 10px;
  font-weight: bold;
  font-size: 1.2em;
}

.city-avatar {
  margin-right: 10px;
  border: 1px solid #7a7a7a;
}

.city-owner {
  background-color: rgb(255 180 29);
  padding: 8px 10px;
  border-radius: 5px;
  text-decoration: none;
}
</style>
