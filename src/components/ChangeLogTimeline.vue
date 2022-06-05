<template>
  <div class="change-logs-wrapper">
    <div class="text-h4 change-logs-title">変更履歴</div>
    <div class="change-logs">
      <div v-if="!loading && items.length !== 0" class="change-items">
        <div v-for="(item, i) in items" :key="i" class="change-item">
          <div class="item-dot"></div>
          <div class="item-body">
            <div class="text-h5 item-title" v-text="item.title" />
            <div
              v-if="item.description"
              class="item-description"
              v-text="item.description"
            />
          </div>
          <div class="item-date" v-text="item.date" />
          <div v-if="item.pending" class="item-pending">Pending</div>
        </div>
      </div>
      <div class="change-logs-progress-wrapper">
        <v-progress-circular
          v-if="loading"
          class="change-logs-progress"
          :size="100"
          indeterminate
        ></v-progress-circular>
      </div>
      <div v-if="!loading && items.length === 0" class="change-logs-notfound">
        データがみつかりませんでした。
      </div>
    </div>
    <div v-if="!loading && items.length !== 0" class="change-now">
      <div class="change-border"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import City, { Corner } from '~/api/models/city'
import {
  ChangeCornersRequest,
  ChangeInformationRequest,
  CityChange,
} from '~/api/models/city-change'

interface Item {
  title: string
  description: string | null
  date: string
  pending: boolean
}

export default Vue.extend({
  props: {
    city: {
      type: Object as () => City,
      required: false,
      default: null,
    },
  },
  data(): {
    items: Item[]
    loading: boolean
  } {
    return {
      items: [],
      loading: true,
    }
  },
  watch: {
    city() {
      this.fetch()
    },
  },
  mounted() {
    this.fetch()
  },
  methods: {
    fetch() {
      if (this.city == null) {
        return
      }
      this.items = []

      this.loading = true
      this.$axios
        .get(`/cities/${this.city.id}/history`)
        .then((response: { data: CityChange[] }) => {
          this.items = this.processItems(response.data)

          this.loading = false
        })
        .catch((error: any) => {
          this.loading = false
          alert('自治体更新履歴の取得に失敗しました。')
          // eslint-disable-next-line no-console
          console.error(error)
        })
    },
    processItems(changes: CityChange[]) {
      const items: Item[] = []

      changes.reverse().forEach((change: CityChange) => {
        const item: Item = {
          title: this.getTitleFromCityChange(change),
          description: this.getDescriptionFromCityChange(change),
          date: this.formatDate(
            new Date(change.createdAt),
            'yyyy/MM/dd\nHH:mm:ss'
          ),
          pending: change.pending,
        }

        items.push(item)
      })

      return items
    },
    getTitleFromCityChange(change: CityChange) {
      switch (change.type) {
        case 'new':
          return '新規自治体登録'
        case 'change-info':
          return '自治体情報変更'
        case 'change-corners':
          return '自治体範囲変更'
      }
    },
    getDescriptionFromCityChange(change: CityChange) {
      switch (change.type) {
        case 'new': {
          return null
        }
        case 'change-info': {
          const data = change.data as ChangeInformationRequest
          const changeCount = [
            data.cityName,
            data.cityKana,
            data.regionName,
            data.summary,
            data.nameOrigin,
          ].filter((value) => value && value.old !== value.new).length
          return changeCount + ' 件の項目に変更'
        }
        case 'change-corners': {
          const data = change.data as ChangeCornersRequest
          return (
            this.countBlocks(data.corners.old) +
            ' blocks\n-> ' +
            this.countBlocks(data.corners.new) +
            ' blocks'
          )
        }
      }
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
    countBlocks(value: Corner[]) {
      let count = 0
      let size = 0
      let side = 0
      value.reduce(
        (a: { x: number; z: number }, b: { z: number; x: number }) => {
          size += (a.x - 0) * (b.z - 0) - (b.x - 0) * (a.z - 0)
          side += Math.abs(a.x - 0 - (b.x - 0)) + Math.abs(a.z - 0 - (b.z - 0))
          return b
        },
        value.slice(-1)[0]
      )
      count = Math.abs(size / 2) + side / 2 + 1
      return count
    },
  },
})
</script>

<style lang="scss" scoped>
.change-logs-wrapper {
  position: relative;
  color: #fff;
  background: #1c1c1c;
}

.change-logs {
  position: relative;

  overflow-x: scroll;

  height: 330px;
}

.change-logs-title {
  position: absolute;
  top: 15px;
  left: 15px;
}

.change-items {
  position: absolute;
  display: flex;
  flex-direction: row;

  top: 150px;
  left: 100px;
}

.change-item {
  position: relative;
  top: 90px;
  width: 150px;
  border-bottom: 10px solid #fff;
}

.change-item .item-dot {
  position: absolute;
  top: -8px;
  left: -7px;
  width: 27px;
  height: 27px;
  border-radius: 50%;
  border: 5px solid #fff;
  background: #ffb41d;
  z-index: 10;
}

.change-item .item-body {
  position: absolute;
  top: -37px;
  left: 33px;
  width: 200px;
  transform-origin: 0% 50%;
  transform: rotate(-45deg);
}

.change-item .item-description {
  margin-left: 35px;
  font-size: 0.8em;
  text-indent: -1em;
  white-space: pre-wrap;
}

.change-item .item-date {
  position: absolute;
  top: 12px;
  left: 28px;
  font-size: 13px;
}

.change-item .item-pending {
  position: absolute;
  top: 33px;
  left: 45px;
  font-size: 10px;
  color: #ffb41d;
  background: #ffb41d4d;
  padding: 1px 10px;
  border-radius: 5px;
  font-style: normal;
  font-weight: 600;
  font-family: 'Inter';
}

.change-now {
  overflow-x: hidden;
}

.change-now .change-border {
  position: absolute;
  top: 240px;
  left: 100px;
  width: 1000px;
  border-bottom: 10px solid #fff;
}

.change-logs-progress-wrapper,
.change-logs-notfound {
  position: absolute;
  top: 150px;
  width: 100%;
  text-align: center;
}
</style>
