import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { AirPort } from '@/types'
import { fetchAirportsFromKayak } from '@/api'

export const useAirportsStore = defineStore('airports', () => {
  const airportsListFrom = ref<AirPort[]>([])
  const airportsListTo = ref<AirPort[]>([])
  const loadingAirportsFrom = ref(false)
  const loadingAirportsTo = ref(false)

  function fetchAirports(input: string) {
    return fetchAirportsFromKayak(input)
  }

  async function fetchAirportsFrom(input: string) {
    loadingAirportsFrom.value = true
    airportsListFrom.value = await fetchAirports(input)
    loadingAirportsFrom.value = false
  }

  async function fetchAirportsTo(input: string) {
    loadingAirportsTo.value = true
    airportsListTo.value = await fetchAirports(input)
    loadingAirportsTo.value = false
  }

  function swapAirports() {
    const temp = airportsListFrom.value

    airportsListFrom.value = airportsListTo.value
    airportsListTo.value = temp
  }

  return {
    airportsListFrom,
    airportsListTo,
    loadingAirportsFrom,
    loadingAirportsTo,
    fetchAirportsFrom,
    fetchAirportsTo,
    swapAirports
  }
})
