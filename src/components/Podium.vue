<template>
  <div class="podium-wrapper">
    <div class="podium">
      <div class="podium-row">
        <div class="podium-frame"></div>
        <div class="podium-frame">
          <v-img
            :src="
              'https://crafatar.com/avatars/' + second.uuid + '?size=40&overlay'
            "
            height="70"
            width="70"
            class="podium-image"
          />
        </div>
        <div class="podium-frame"></div>
      </div>
      <div class="podium-row">
        <div class="podium-frame">
          <v-img
            :src="
              'https://crafatar.com/avatars/' + first.uuid + '?size=40&overlay'
            "
            height="70"
            width="70"
            class="podium-image"
          />
        </div>
        <div class="podium-block"></div>
        <div class="podium-frame"></div>
      </div>
      <div class="podium-row">
        <div class="podium-block"></div>
        <div class="podium-block"></div>
        <div class="podium-frame">
          <v-img
            :src="
              'https://crafatar.com/avatars/' + third.uuid + '?size=40&overlay'
            "
            height="70"
            width="70"
            class="podium-image"
          />
        </div>
      </div>
      <div class="podium-row">
        <div class="podium-block"></div>
        <div class="podium-block"></div>
        <div class="podium-block"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { PeriodMatchPlayer } from '~/api/models/periodmatch-result'
export default Vue.extend({
  name: 'PodiumComponent',
  props: {
    first: {
      type: Object as () => PeriodMatchPlayer,
      required: true,
    },
    second: {
      type: Object as () => PeriodMatchPlayer,
      required: true,
    },
    third: {
      type: Object as () => PeriodMatchPlayer,
      required: true,
    },
  },
})
</script>

<style>
.podium-image {
  margin: 0 auto;
}

.podium-frame {
  background-color: #eee;
  height: 70px;
  width: 150px;
  margin: 0;
  padding: 0;
  border: none !important;
}

.podium-block {
  background-color: #000;
  height: 70px;
  width: 150px;
  margin: 0;
  padding: 0;
  border: none !important;
}

.podium-row {
  display: flex;
}

.podium-wrapper {
  display: flex;
  justify-content: center;
}
</style>
