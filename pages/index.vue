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
              :disabled-dates="disablePastDates"
              :input-class="dateValidate"
              format="dd MMM yyyy"
              :placeholder="$dateFns.format(new Date(), 'dd MMM yyyy')"
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
              :disabled-dates="disablePastDates"
              format="dd MMM yyyy"
              input-class="form-control"
              :placeholder="$dateFns.format(new Date(), 'dd MMM yyyy')"
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

  // async asyncData({ $axios }) {
  //   const getStations = await $axios.get(
  //     `/apiservices/autosuggest/v1.0/UK/GBP/en-GB/`,
  //     {
  //       params: {
  //         query: 'Philippines',
  //       },
  //     }
  //   )

  //   return { stations: getStations.data.Places }
  // },
  data: () => ({
    isUpdating: false,
    search: {
      arrivalStation: {
        countryName: '',
        placeId: '',
        placeName: '',
      },
      departureStation: {
        countryName: '',
        placeId: '',
        placeName: '',
      },
      departureDate: '',
      returnDate: '',
    },
    disablePastDates: {
      to: new Date(Date.now() - 3600 * 1000 * 24),
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
    async filterDepartureStations(val) {
      // check for value
      if (!val.length) {
        return []
      }

      const getStations = await this.$axios.get(
        `/apiservices/autosuggest/v1.0/UK/GBP/en-GB/`,
        {
          params: {
            query: val,
          },
        }
      )

      return getStations.data.Places
    },

    onDepartureStationSelected(station) {
      this.search.departureStation.countryName = station.CountryName
      this.search.departureStation.placeId = station.PlaceId
      this.search.departureStation.placeName = station.PlaceName
    },

    async filterArrivalStations(val) {
      // check for value
      if (!val.length) {
        return []
      }

      const getStations = await this.$axios.get(
        `/apiservices/autosuggest/v1.0/UK/GBP/en-GB/`,
        {
          params: {
            query: val,
          },
        }
      )

      return getStations.data.Places
    },

    onArrivalStationSelected(station) {
      this.search.arrivalStation.countryName = station.CountryName
      this.search.arrivalStation.placeId = station.PlaceId
      this.search.arrivalStation.placeName = station.PlaceName
    },

    searchFlights() {
      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toastr.e('There are some errors on the form')

        return
      }

      const payload = {
        departureDate: this.$dateFns.format(
          this.search.departureDate,
          'yyyy-MM-dd'
        ),
      }

      console.log(payload)
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

  label {
    margin-bottom: 0;
  }

  .btn-default {
    font-size: 20px;
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
