import { defineStore } from 'pinia'
import axios from 'axios'

import placesJson from '@/data/places.json'
import { findClosestPeople } from '@/utils/places';

const { VITE_APP_API_URL } = import.meta.env

export enum PlaceType {
  Store = 'store',
  Office = 'office',
  Cafe = 'cafe'
}

export const PLACE_TYPE_LIST: { text: string; value: string }[] = [
  { text: 'Магазин', value: PlaceType.Store },
  { text: 'Офiс', value: PlaceType.Office },
  { text: 'Кафе', value: PlaceType.Cafe }
]

export type Place = {
  id: number
  name: string
  type: PlaceType
  coordinates: [number, number]
}

// [Consider] Also we can separate to PersonDto and Person
export type Person = {
  id: number
  name: string
  address: {
    geo: {
      lat: string
      lng: string
    }
  }
  isClosest?: boolean
  distance?: number
}

type PlacesState = {
  places: Place[]
  people: Person[],
  selectedType: string,
  selectedPlace: Place | null
}

export const usePlacesStore = defineStore('places', {
  state(): PlacesState {
    return {
      places: [],
      people: [],
      selectedType: '',
      selectedPlace: null
    }
  },
  getters: {
    filteredPlaces(state): Place[] {
      return state.selectedType
        ? state.places.filter(p => p.type === state.selectedType)
        : state.places
    },
    evaluatedPeople(state): Person[] {
      if (!state.selectedPlace) return state.people

      // [Consider] Also can be separated to 2 different arrays with different classes (2nd class with isClosest and distance),
      // but I think one class are better in this situation

      // Array of people with calculated fields: isClosest, distance
      return findClosestPeople(state.people, state.selectedPlace.coordinates, 3)
    }
  },
  actions: {
    async loadData() {
      this.places = placesJson as Place[]
      const res = await axios.get<Person[]>(`${VITE_APP_API_URL}/users`)
      this.people = res.data
    },
    setTypeFilter(type: string) {
      this.selectedType = type
    },
    setSelectedPlace(place: Place | null) {
      this.selectedPlace = place
    },
    resetFilter() {
      this.selectedType = ''
    },
    addPlace(place: Place) {
      this.places = [...this.places, place]
    },
  },
})
