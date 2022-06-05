<template>
  <div class="podium-wrapper">
    <div class="podium">
      <div class="podium-row">
        <div class="podium-frame"></div>
        <div class="podium-frame">
          <v-img
            v-if="first"
            :src="
              'https://crafatar.com/avatars/' + first.uuid + '?size=50&overlay'
            "
            height="50"
            width="50"
            class="podium-image"
          />
        </div>
        <div class="podium-frame"></div>
      </div>
      <div class="podium-row">
        <div class="podium-frame">
          <v-img
            v-if="second"
            :src="
              'https://crafatar.com/avatars/' + second.uuid + '?size=50&overlay'
            "
            height="50"
            width="50"
            class="podium-image"
          />
        </div>
        <div class="podium-block">1</div>
        <div class="podium-frame"></div>
      </div>
      <div class="podium-row">
        <div class="podium-block">2</div>
        <div class="podium-block"></div>
        <div class="podium-frame">
          <v-img
            v-if="third"
            :src="
              'https://crafatar.com/avatars/' + third.uuid + '?size=50&overlay'
            "
            height="50"
            width="50"
            class="podium-image"
          />
        </div>
      </div>
      <div class="podium-row">
        <div class="podium-block"></div>
        <div class="podium-block"></div>
        <div class="podium-block">3</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { PeriodMatchPlayer } from '~/api/models/periodmatch'
export default Vue.extend({
  name: 'PeriodMatchPodiumComponent',
  props: {
    first: {
      type: Object as () => PeriodMatchPlayer,
      required: false,
      default: null,
    },
    second: {
      type: Object as () => PeriodMatchPlayer,
      required: false,
      default: null,
    },
    third: {
      type: Object as () => PeriodMatchPlayer,
      required: false,
      default: null,
    },
  },
})
</script>

<style>
.podium-image {
  margin: 0 auto;
}

.podium-frame {
  height: 50px;
  width: 120px;
  margin: 0;
  padding: 0;
  border: none !important;
}

.podium-block {
  background-color: #000;
  height: 50px;
  width: 120px;
  margin: 0;
  padding: 0;
  border: none !important;
  color: white;
  font-size: 2em;
  text-align: center;
}

.podium-row {
  display: flex;
}

.podium-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}
</style>
