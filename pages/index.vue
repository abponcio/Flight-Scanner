<template>
  <!-- Search Flights -->
  <div class="search-flights">
    <form class="row" @submit.prevent="searchFlights()">
      <div class="col-md-8">
        <div class="form-row">
          <div class="form-group col-md-3">
            <label>Departing Station</label>
            <Stations
              v-model="search.departureStation.countryName"
              :disabled="isUpdating"
              :options="{ placeholder: 'Select Your Origin' }"
              :on-input-change="filterDepartureStations"
              :on-item-selected="onDepartureStationSelected"
            />
          </div>
          <div class="form-group col-md-3">
            <label>Arrival Station</label>
            <Stations
              v-model="search.arrivalStation.countryName"
              :disabled="isUpdating"
              :options="{ placeholder: 'Select Your Destination' }"
              :on-input-change="filterArrivalStations"
              :on-item-selected="onArrivalStationSelected"
            />
          </div>
          <div class="form-group col-md-3">
            <label>Flight Depart Date</label>
            <Datepicker
              v-model="search.departureDate"
              format="dd MMM yyyy"
              input-class="form-control"
              placeholder="01 Jan 2020"
            ></Datepicker>
          </div>
          <div class="form-group col-md-3">
            <label>Flight Return Date</label>
            <Datepicker
              v-model="search.returnDate"
              format="dd MMM yyyy"
              input-class="form-control"
              placeholder="01 Jan 2020"
            ></Datepicker>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="form-row float-right">
          <div class="form-group col-md-12">
            <label>&nbsp;</label>
            <button class="btn btn-default btn-sm" type="submit">
              Search Flights
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import Stations from '~/components/Stations.vue'

export default {
  components: {
    Stations,
  },

  async asyncData({ $axios }) {
    const getStations = await $axios.get(
      `/apiservices/autosuggest/v1.0/UK/GBP/en-GB/`,
      {
        params: {
          query: 'Philippines',
        },
      }
    )

    return { stations: getStations.data.Places }
  },
  data: () => ({
    isUpdating: false,
    sort: {
      departureDate: false,
      arrivalDate: false,
      flightNumber: false,
    },
    search: {
      arrivalStation: {
        placeName: '',
        countryName: '',
      },
      departureStation: {
        placeName: '',
        countryName: '',
      },
      departureDate: null,
      returnDate: null,
      desc: false,
      flightNumber: null,
      sortby: null,
    },
  }),

  methods: {
    filterDepartureStations(val) {
      // check for value
      if (!val.length) {
        return this.stations
      }

      // lowercase
      val = val.toLowerCase()

      return this.stations.filter(
        (station) =>
          station.PlaceName.toLowerCase().includes(val) ||
          station.CountryName.toLowerCase().includes(val)
      )
    },

    onDepartureStationSelected(station) {
      this.search.departureStation.countryName = `${station.PlaceName}`
      this.search.departureStation.placeName = station.CountryName
    },

    filterArrivalStations(val) {
      // get all stations
      const stations = JSON.parse(JSON.stringify(this.stations))

      // we will not include the station from selected departure station
      stations.splice(
        stations.findIndex(
          (station) =>
            station.PlaceName === this.search.departureStation.countryName
        ),
        1
      )

      // check for value
      if (!val.length) {
        return stations
      }

      // lowercase
      val = val.toLowerCase()

      return this.stations.filter(
        (station) =>
          station.PlaceName.toLowerCase().includes(val) ||
          station.CountryName.toLowerCase().includes(val)
      )
    },

    onArrivalStationSelected(station) {
      this.search.arrivalStation.countryName = `${station.PlaceName}`
      this.search.arrivalStation.placeName = station.CountryName
    },
  },
}
</script>

<style lang="scss" scoped></style>
