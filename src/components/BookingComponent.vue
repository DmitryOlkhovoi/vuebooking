<script setup lang="ts">
import { ref } from 'vue'
import { type SelectOption, type AirPort, TRIP_TYPE, CLASS_TYPE } from '@/types.d'
import { useAirportsStore } from '@/stores/airports'
import { storeToRefs } from 'pinia'

const TRIP_TYPE_OPTIONS: SelectOption[] = [
  {
    name: 'Round Trip',
    code: TRIP_TYPE.ROUND
  },
  {
    name: 'One Way',
    code: TRIP_TYPE.ONE_WAY
  }
]

const CLASS_TYPE_OPTIONS: SelectOption[] = [
  {
    name: 'Economy',
    code: CLASS_TYPE.ECONOMY
  },
  {
    name: 'Busness',
    code: CLASS_TYPE.BUSNESS
  },
  {
    name: 'First',
    code: CLASS_TYPE.FIRST
  }
]

interface InputEvent {
  query: string
}

const airportsStore = useAirportsStore()
const { airportsListFrom, airportsListTo, loadingAirportsFrom, loadingAirportsTo } =
  storeToRefs(airportsStore)

const tripType = ref<SelectOption>(TRIP_TYPE_OPTIONS[0])
const classType = ref<SelectOption>(CLASS_TYPE_OPTIONS[0])
const airportFrom = ref<AirPort>()
const airportTo = ref<AirPort>()
const result = ref()
const errors = ref<{ [key: string]: string | null }>({})
const dateFrom = ref(new Date())
const dateTo = ref(new Date())
const datesHightlight = ref<Date[]>([])
const adultsNumber = ref(1)
const childrenNumber = ref(0)

function searchAirportsFrom(event: InputEvent) {
  if (event.query.trim().length) {
    airportsStore.fetchAirportsFrom(event.query)
  }
}

function searchAirportsTo(event: InputEvent) {
  if (event.query.trim().length) {
    airportsStore.fetchAirportsTo(event.query)
  }
}

function swapAirports() {
  const temp = airportFrom.value

  airportFrom.value = airportTo.value
  airportTo.value = temp

  airportsStore.swapAirports()
}

// It's a good practice to use some 3d party lib for validation
// For simplicity I'm doing it myself
function validate() {
  if (!airportFrom.value) {
    errors.value.airportFrom = 'please select an airport'
  }

  if (!airportTo.value) {
    errors.value.airportTo = 'please select an airport'
  }

  if (!dateFrom.value) {
    errors.value.dateFrom = 'please select a date'
  }

  if (!dateTo.value) {
    errors.value.dateTo = 'please select a date'
  }
}

// reset errors
function onValueUpdate(field: string) {
  errors.value[field] = null
}

function onSubmit() {
  validate()

  result.value = {
    tripType: tripType.value,
    classType: classType.value,
    adultsNumber: adultsNumber.value,
    childrenNumber: childrenNumber.value,
    airportFrom: airportFrom.value,
    airportTo: airportTo.value,
    dateFrom: dateFrom.value,
    dateTo: tripType.value.code === TRIP_TYPE.ROUND ? dateTo.value : null
  }

  // For review
  console.log(result.value)
}

function onDateFromUpdate(value: Date) {
  if (value > dateTo.value) {
    dateTo.value = value
  }

  errors.value.dateFrom = null
  onDateUpate()
}

function onDateToUpdate(value: Date) {
  onDateUpate()
  errors.value.dateTo = null
}

function onDateUpate() {
  if (dateFrom.value && dateTo.value) datesHightlight.value = getDates(dateFrom.value, dateTo.value)
}

// Gets array to highlight range
function getDates(start: Date, end: Date) {
  for (var arr = [], dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
    arr.push(new Date(dt))
  }
  return arr
}
</script>

<template>
  <div class="booking">
    <div class="card flex flex-column md:flex-row gap-3 mb-2">
      <Dropdown v-model="tripType" :options="TRIP_TYPE_OPTIONS" optionLabel="name" />
      <Dropdown v-model="classType" :options="CLASS_TYPE_OPTIONS" optionLabel="name" />
      <div class="card flex flex-column md:flex-row gap-3">
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-user"></i>
          </span>
          <InputNumber v-model="adultsNumber" :min="1" :max="10" showButtons />
        </div>
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-github"></i>
          </span>
          <InputNumber v-model="childrenNumber" :min="0" :max="10" showButtons />
        </div>
      </div>
    </div>
    <div class="card flex flex-column md:flex-row gap-3">
      <div>
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-arrow-up-right"></i>
          </span>
          <AutoComplete
            :class="{ 'p-invalid': errors.airportFrom }"
            placeholder="From"
            v-model="airportFrom"
            optionLabel="displayname"
            :suggestions="airportsListFrom"
            :loading="loadingAirportsFrom"
            @complete="searchAirportsFrom"
            @update:modelValue="onValueUpdate('airportFrom')"
          />
        </div>
        <div class="p-error" id="text-error">{{ errors.airportFrom }}</div>
      </div>
      <Button icon="pi pi-arrow-right-arrow-left" @click="swapAirports" />
      <div>
        <div class="p-inputgroup flex-1">
          <span class="p-inputgroup-addon">
            <i class="pi pi-arrow-down-right"></i>
          </span>
          <AutoComplete
            :class="{ 'p-invalid': errors.airportTo }"
            placeholder="To Where?"
            v-model="airportTo"
            optionLabel="displayname"
            :suggestions="airportsListTo"
            :loading="loadingAirportsTo"
            @complete="searchAirportsTo"
            @update:modelValue="onValueUpdate('airportTo')"
          />
        </div>
        <div class="p-error" id="text-error">{{ errors.airportTo }}</div>
      </div>

      <div class="p-inputgroup flex-1">
        <VueDatePicker
          placeholder="Select date"
          v-model="dateFrom"
          :highlight="datesHightlight"
          auto-apply
          :state="errors.dateFrom ? false : null"
          @update:modelValue="onDateFromUpdate"
        />
      </div>

      <div v-if="tripType.code === TRIP_TYPE.ROUND" class="p-inputgroup flex-1">
        <VueDatePicker
          placeholder="Select date"
          :highlight="datesHightlight"
          v-model="dateTo"
          :min-date="dateFrom"
          :state="errors.dateTo ? false : null"
          auto-apply
          @update:modelValue="onDateToUpdate"
        />
      </div>
      <Button label="Search Flights" @click="onSubmit" />
    </div>
  </div>

  <template v-if="result">
    <div class="bg-black p-10">{{ result }}</div>
  </template>
</template>

<style scoped lang="postcss">
.booking {
  @apply p-11;
  width: 1200px;
}

.p-error {
  @apply absolute;
}

::v-deep(.dp__input) {
  height: 50px;
}
</style>
