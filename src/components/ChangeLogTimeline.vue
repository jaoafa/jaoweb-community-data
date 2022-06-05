<template>
  <div class="change-logs-wrapper">
    <div class="text-h4 change-logs-title">変更履歴</div>
    <div class="change-logs">
      <div class="change-items">
        <div v-for="item of items" :key="item.title" class="change-item">
          <div class="item-dot"></div>
          <div class="item-body">
            <div class="text-h5 item-title" v-text="item.title" />
            <div class="item-description" v-text="item.description" />
          </div>
          <div class="item-date" v-text="item.date" />
          <div v-if="item.pending" class="item-pending">Pending</div>
        </div>
      </div>
    </div>
    <div class="change-now">
      <div class="change-border"></div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

interface Item {
  title: string
  description: string
  date: string
  pending: boolean
}

export default Vue.extend({
  data(): {
    items: Item[]
  } {
    return {
      items: [
        {
          title: '自治体名称変更',
          description: 'Nazo City Name\n -> Old City Name',
          date: '2022年06月03日',
          pending: true,
        },
        {
          title: '自治体範囲変更',
          description: '659 Blocks\n -> 6590 Blocks',
          date: '2022年6月2日',
          pending: false,
        },
        {
          title: '自治体概要変更',
          description: 'Before: Nazo no city.',
          date: '2022年6月1日',
          pending: false,
        },
        {
          title: '自治体名称変更',
          description: 'Old City Name\n -> City Name',
          date: '2022年6月1日',
          pending: false,
        },
        {
          title: 'Lorem ipsum',
          description:
            'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit',
          date: 'yyyy年MM月dd日',
          pending: false,
        },
        {
          title: 'Lorem ipsum',
          description:
            'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit',
          date: 'yyyy年MM月dd日',
          pending: false,
        },
        {
          title: 'Lorem ipsum',
          description:
            'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit',
          date: 'yyyy年MM月dd日',
          pending: false,
        },
        {
          title: 'Lorem ipsum',
          description:
            'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit',
          date: 'yyyy年MM月dd日',
          pending: false,
        },
        {
          title: 'Lorem ipsum',
          description:
            'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit',
          date: 'yyyy年MM月dd日',
          pending: false,
        },
        {
          title: 'Lorem ipsum',
          description:
            'Lorem ipsum dolor sit amet,\nconsectetur adipiscing elit',
          date: 'yyyy年MM月dd日',
          pending: false,
        },
      ],
    }
  },
  mounted() {},
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
</style>
