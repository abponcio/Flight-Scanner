<template>
  <section class="box-container box-shadow">
    <h1 class="page-heading">Where would you like to go?</h1>
    <!-- Search Flights -->
    <div class="search-flights">
      <form @submit.prevent="searchFlights()">
        <div class="form-row">
          <div class="form-group col-md-6">
            <label>Departing Station</label>
            <Stations
              v-model="search.departureStation.placeName"
              :is-invalid="$v.search.departureStation.placeName.$error"
              :disabled="isUpdating"
              :options="{ placeholder: 'Select Your Origin' }"
              :on-input-change="filterDepartureStations"
              :on-item-selected="onDepartureStationSelected"
            />
            <div
              v-if="$v.search.departureStation.placeName.$error"
              class="text-danger text-left"
            >
              <small v-if="!$v.search.departureStation.placeName.required"
                >Departing Station is required</small
              >
            </div>
          </div>
          <div class="form-group col-md-6">
            <label>Arrival Station</label>
            <Stations
              v-model="search.arrivalStation.placeName"
              :is-invalid="$v.search.arrivalStation.placeName.$error"
              :disabled="isUpdating"
              :options="{ placeholder: 'Select Your Destination' }"
              :on-input-change="filterArrivalStations"
              :on-item-selected="onArrivalStationSelected"
            />
            <div
              v-if="$v.search.arrivalStation.placeName.$error"
              class="text-danger text-left"
            >
              <small v-if="!$v.search.arrivalStation.placeName.required"
                >Arrival Station is required</small
              >
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-6">
            <label>Departure Date</label>
            <Datepicker
              v-model="search.departureDate"
              format="dd MMM yyyy"
              :input-class="dateValidate"
              placeholder="01 Jan 2020"
            ></Datepicker>
            <div
              v-if="$v.search.departureDate.$error"
              class="text-danger text-left"
            >
              <small v-if="!$v.search.departureDate.required"
                >Departure Date is required</small
              >
            </div>
          </div>
          <div class="form-group col-md-6">
            <label>Return Date</label>
            <Datepicker
              v-model="search.returnDate"
              format="dd MMM yyyy"
              input-class="form-control"
              placeholder="01 Jan 2020"
            ></Datepicker>
          </div>
        </div>

        <button class="btn btn-default btn-sm" type="submit">
          Search Flights
        </button>
      </form>
    </div>
  </section>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import Stations from '~/components/Stations.vue'

export default {
  components: {
    Stations,
  },

  validations() {
    return {
      search: {
        departureStation: {
          placeName: { required },
        },
        arrivalStation: {
          placeName: { required },
        },
        departureDate: { required },
      },
    }
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

  computed: {
    dateValidate() {
      if (this.$v.search.departureDate.$error) {
        return 'form-control is-invalid'
      }

      return 'form-control'
    },
  },

  methods: {
    filterDepartureStations(val) {
      // get all stations
      const stations = JSON.parse(JSON.stringify(this.stations))

      // we will not include the station from selected arrival station
      stations.splice(
        stations.findIndex(
          (station) =>
            station.PlaceName === this.search.arrivalStation.placeName
        ),
        1
      )

      // check for value
      if (!val.length) {
        return this.stations
      }

      // lowercase
      val = val.toLowerCase()

      return stations.filter(
        (station) =>
          station.PlaceName.toLowerCase().includes(val) ||
          station.CountryName.toLowerCase().includes(val)
      )
    },

    onDepartureStationSelected(station) {
      this.search.departureStation.placeName = station.PlaceName
      this.search.departureStation.countryName = station.CountryName
    },

    filterArrivalStations(val) {
      // get all stations
      const stations = JSON.parse(JSON.stringify(this.stations))

      // we will not include the station from selected departure station
      stations.splice(
        stations.findIndex(
          (station) =>
            station.PlaceName === this.search.departureStation.placeName
        ),
        1
      )

      // check for value
      if (!val.length) {
        return stations
      }

      // lowercase
      val = val.toLowerCase()

      return stations.filter(
        (station) =>
          station.PlaceName.toLowerCase().includes(val) ||
          station.CountryName.toLowerCase().includes(val)
      )
    },

    onArrivalStationSelected(station) {
      this.search.arrivalStation.placeName = station.PlaceName
      this.search.arrivalStation.countryName = station.CountryName
    },

    searchFlights() {
      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toastr.e('There are some errors on the form')

        return
      }

      console.log('wee')
    },
  },
}
</script>

<style lang="scss" scoped>
.box-container {
  margin: 100px auto 0 auto;
  max-width: 600px;
  padding: 50px;

  h1 {
    font-family: $kautivaCyrillicBlackFont;
    margin-bottom: 15px;
    text-align: center;
    font-size: clamp(25px, 8vw, 40px);
  }

  .btn-default {
    margin-top: 15px;
    width: 100%;
  }
}

@media (max-width: 575.98px) {
  .box-container {
    padding: 20px;
  }
}
</style>
