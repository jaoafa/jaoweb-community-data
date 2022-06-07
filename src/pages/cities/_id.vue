<template>
  <v-container fluid>
    <h2>登録自治体一覧</h2>

    <v-row>
      <v-col cols="4" class="col-overflow">
        <v-progress-linear v-if="loading.cities" indeterminate />
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

      <v-col v-if="getSelectCity() == null" cols="8">
        <p>左側のリストから自治体を選択してください。</p>
      </v-col>

      <v-col v-if="getSelectCity() != null" cols="8" class="col-overflow">
        <v-row>
          <v-col md="10" cols="12">
            <h2 class="text-h4 city-owner-text">
              <span class="city-border" />
              <span class="city-title">{{ getSelectCity().name }}</span>
              <span class="city-by">by</span>
              <a
                class="city-owner"
                :href="`https://users.jaoafa.com/${getSelectCity().owner.uuid}`"
              >
                <v-avatar class="city-avatar" :size="40">
                  <v-img
                    :src="getMinecraftAvatar(getSelectCity().owner.uuid)"
                  ></v-img>
                </v-avatar>
                <span v-if="selectedPlayer">{{ selectedPlayer.mcid }}</span>
                <span v-else>{{ getSelectCity().owner.mcid }}</span>
              </a>
            </h2>
          </v-col>
          <v-col md="2" cols="12" class="text-right">
            <v-btn
              icon
              elevation="5"
              large
              class="mx-1"
              :disabled="selectedItem == 0"
              @click="prev()"
            >
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn
              icon
              elevation="5"
              large
              class="mx-1"
              :disabled="selectedItem == items.length - 1"
              @click="next()"
            >
              <v-icon>mdi-arrow-right</v-icon>
            </v-btn>
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
            <v-textarea
              solo
              readonly
              :rows="3"
              :value="getSelectCity().summary"
            />

            <h3>自治体名称の由来</h3>
            <v-textarea
              solo
              readonly
              :rows="3"
              :value="getSelectCity().nameOrigin"
            />

            <h3>最終ログイン日時</h3>

            <v-textarea
              v-if="selectedPlayer"
              solo
              readonly
              :rows="1"
              :value="
                selectedPlayer.lastlogin +
                ' (' +
                calcDiffDays(new Date(), new Date(selectedPlayer.lastlogin)) +
                '日前)'
              "
            />
          </v-col>
          <v-col cols="6">
            <iframe class="dynmap-iframe" :src="dynmapUrl"></iframe>
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
import City, { Corner } from '~/api/models/city'
import getMinecraftUser, { MinecraftUser } from '~/lib/getMinecraftUser'

export default Vue.extend({
  name: 'CitiesIndexPage',
  data(): {
    selectedItem: string
    selectedPlayer: MinecraftUser | null
    items: City[]
    dynmapUrl: string
    loading: {
      cities: boolean
    }
  } {
    return {
      selectedItem: '',
      selectedPlayer: null,
      items: [],
      dynmapUrl: '',
      loading: {
        cities: true,
      },
    }
  },
  head() {
    return {
      title: '登録自治体一覧',
    }
  },
  watch: {
    async selectedItem() {
      const city = this.getSelectCity()
      if (city == null) {
        return
      }
      if (this.$route.params.id === city.id.toString()) {
        return
      }
      history.replaceState({}, '', 'cities/' + city.id.toString())
      this.$route.params.id = city.id.toString()
      this.dynmapUrl = this.getDynmapUrl(city)

      this.selectedPlayer = null
      this.selectedPlayer = await getMinecraftUser(
        this.$recaptcha,
        city.owner.uuid
      )
    },
  },
  created() {
    this.fetch()

    this.$nuxt.$on('fetch-button', this.fetch)
  },
  methods: {
    fetch() {
      this.items = []
      this.selectedPlayer = null
      this.loading.cities = true

      this.$recaptcha.execute('login').then((token: string) => {
        this.$axios
          .get('/cities', {
            headers: {
              'X-RECAPTCHA-TOKEN': token,
            },
          })
          .then((response: { data: City[] }) => {
            this.items = response.data
            this.loading.cities = false

            if (this.$route.params.id) {
              this.selectedItem = this.items
                .findIndex(
                  (item: City) => item.id.toString() === this.$route.params.id
                )
                .toString()
            }
            const city = this.getSelectCity()
            if (city) {
              this.dynmapUrl = this.getDynmapUrl(city)
              getMinecraftUser(this.$recaptcha, city.owner.uuid).then(
                (player) => {
                  this.selectedPlayer = player
                }
              )
            }
          })
      })
    },
    getMinecraftAvatar(uuid: string) {
      if (uuid === null || uuid === 'null') {
        return this.$router.history.base + '/jaoafa.png'
      }
      return `https://crafatar.com/avatars/${uuid}?size=30&overlay`
    },
    getDynmapUrl(city: City) {
      const x = city.corners.map((corner: Corner) => corner.x)
      const z = city.corners.map((corner: Corner) => corner.z)

      const max = Math.max(
        Math.max(...x) - Math.min(...x),
        Math.max(...z) - Math.min(...z)
      )

      const center = {
        x: (Math.min(...x) + Math.max(...x)) / 2,
        z: (Math.min(...z) + Math.max(...z)) / 2,
      }

      let zoom
      if (max < 50) {
        zoom = 6
      } else if (max < 120) {
        zoom = 5
      } else if (max < 240) {
        zoom = 4
      } else if (max < 520) {
        zoom = 3
      } else if (max < 900) {
        zoom = 2
      } else if (max < 2500) {
        zoom = 1
      } else {
        zoom = 0
      }

      return `https://map.jaoafa.com/?worldname=Jao_Afa&mapname=flat&zoom=${zoom}&x=${center.x}&y=100&z=${center.z}`
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
    prev() {
      this.selectedItem = (parseInt(this.selectedItem, 10) - 1).toString()
    },
    next() {
      this.selectedItem = (parseInt(this.selectedItem, 10) + 1).toString()
    },
    calcDiffDays(date1: Date, date2: Date) {
      const diffTime = Math.abs(date2.getTime() - date1.getTime())
      return Math.floor(diffTime / (1000 * 60 * 60 * 24))
    },
  },
})
</script>

<style>
.col-overflow {
  overflow-y: scroll;
  height: calc(100vh - 100px);
}

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
  margin-right: 5px;
  border: 1px solid #7a7a7a;
}

.city-owner {
  background-color: rgb(255 180 29);
  padding: 8px 10px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 80%;
}

.dynmap-iframe {
  width: 100%;
  height: 500px;
}
</style>
