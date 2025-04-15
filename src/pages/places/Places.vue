<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { usePlacesStore } from '@/store/placesStore'
import SidePanel from '@/pages/places/SidePanel.vue'
import Map from '@/pages/places/Map.vue'

import type { Place } from '@/store/placesStore';

const store = usePlacesStore()

const showDialog = ref(false)

const openPlaceDetails = (place: Place) => {
  store.setSelectedPlace(place)
  showDialog.value = true
}

const resetDialog = () => {
  showDialog.value = false
}

onMounted(() => {
  store.loadData()
})
</script>

<template>
  <div class="page">
    <div class="side-panel-section">
      <SidePanel />
    </div>
    <div class="map-section">
      <Map
        :places="store.filteredPlaces"
        :people="store.evaluatedPeople"
        :selected-place="store.selectedPlace"
        :show-dialog="showDialog"
        @close-dialog="resetDialog"
        @select-place="openPlaceDetails"
      />
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
}

.side-panel-section {
  width: 15%;
  height: 100%;
}

.map-section {
  width: 85%;
}
@media screen and (max-width: 1199px) {
  .map-section {
    width: 100%;
  }
  .side-panel-section {
    width: auto;
    height: auto;
    flex: 0;
    z-index: 999;
    position: absolute;
    bottom: 16px;
    left: 16px;
  }
}
</style>