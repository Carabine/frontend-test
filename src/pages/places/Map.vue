<script setup lang="ts">
import { ref, onMounted, nextTick, watch, PropType } from 'vue'
import L from 'leaflet'

import humanIconUrl from '@/assets/icons/human.svg'
import activeHumanIconUrl from '@/assets/icons/activeHuman.svg'
import placeIconUrl from '@/assets/icons/place.png'
import activePlaceIconUrl from '@/assets/icons/activePlace.png'
import { PLACE_TYPE_LIST } from '@/store/placesStore'
import type { Place, Person } from '@/store/placesStore';
import { useWindowSize, WindowSize } from '@/composables/useWindowSize';

const props = defineProps({
  places: {
    type: Array as PropType<Place[]>,
    required: true,
  },
  people: {
    type: Array as PropType<Person[]>,
    required: true,
  },
  selectedPlace: {
    type: Object as PropType<Place | null>,
    required: true,
  },
  showDialog: {
    type: Boolean,
    required: true,
  }
})

const emit = defineEmits(['close-dialog', 'select-place'])

let map: L.Map
let placeLayer: L.LayerGroup
let peopleLayer: L.LayerGroup

const mapInitialized = ref(false)
const { windowSize } = useWindowSize()

// [Consider] incapsulate logic and change png icons to svg
const placeIcon = new L.Icon({
  iconUrl: placeIconUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const activePlaceIcon = new L.Icon({
  iconUrl: activePlaceIconUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const humanIcon = new L.Icon({
  iconUrl: humanIconUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const activeHumanIcon = new L.Icon({
  iconUrl: activeHumanIconUrl,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

const initMap = () => {
  map = L.map('map').setView([50.4501, 30.5234], 3)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map)

  placeLayer = L.layerGroup().addTo(map)
  peopleLayer = L.layerGroup().addTo(map)
  
  mapInitialized.value = true
  renderMarkers()
}

const renderMarkers = () => {
  renderPlaces()
  renderPeople()
}

const renderPlaces = () => {
  placeLayer.clearLayers()
  if (props.places.length > 0) {
    props.places.forEach((place) => {
      L.marker(place.coordinates, { icon: props.selectedPlace?.id === place.id ? activePlaceIcon : placeIcon })
        .on('click', () => {
          emit('select-place', place)
        })
        .addTo(placeLayer)
    })
  }
}

const renderPeople = () => {
  peopleLayer.clearLayers()

  if (props.people.length > 0) {
    props.people.forEach((person) => {
      const lat = parseFloat(person.address.geo.lat)
      const lng = parseFloat(person.address.geo.lng)

      L.marker([lat, lng], { icon: person.isClosest ? activeHumanIcon : humanIcon })
        .bindPopup(`<b>${person.name}</b>`)
        .addTo(peopleLayer)
    })
  }
}

const resetDialog = () => {
  emit('close-dialog')
}

watch(() => props.people, () => {
  if (mapInitialized.value) {
    renderPeople()
  }
})

watch(() => [props.places, props.selectedPlace], () => {
  if (mapInitialized.value) {
    renderPlaces()
  }
})

onMounted(() => {
  nextTick(() => {
    initMap()
  })
})
</script>

<template>
  <div class="map-container">
    <div id="map" class="map"></div>
    <el-dialog
      v-model="props.showDialog"
      title="Детальна інформація"
      @close="resetDialog"
      :width="windowSize === WindowSize.Lg ? '500px' : '90%'"
    >
      <div>
        <h3>{{ props.selectedPlace?.name }}</h3>
        <p>Тип: {{ PLACE_TYPE_LIST.find(t => t.value === props.selectedPlace?.type)?.text ?? props.selectedPlace?.type }}</p>
        <p>Координати: {{ props.selectedPlace?.coordinates.join(', ') }}</p>

        <h4>Найближчі люди:</h4>
        <ul>
          <li v-for="(person, index) in people.filter(p => p.isClosest)" :key="index">
            {{ person.name }} ({{ person.distance?.toFixed(2) ?? '-' }} км)
          </li>
        </ul>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="() => emit('close-dialog')">Закрити</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}

.map {
  height: 100%;
  width: 100%;
  margin: 0 auto;
}

#map {
  overflow: hidden;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>
