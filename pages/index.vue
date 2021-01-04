<template>
  <section class="box-container box-shadow">
    <h1 class="page-heading">Where would you like to go?</h1>
    <!-- Search Flights -->
    <div class="search-flights">
      <form @submit.prevent="searchFlights()">
        <div class="form-row">
          <div class="form-group col-md-6">
            <label>Departing Station</label>
            <multiselect
              v-model="departureStation"
              :clear-on-select="false"
              :hide-selected="true"
              :internal-search="false"
              :loading="isLoadingDepature"
              :options="stations"
              :searchable="true"
              :show-labels="false"
              label="PlaceName"
              open-direction="bottom"
              placeholder="Select Your Destination"
              track-by="PlaceId"
              @search-change="selectDeparture"
            >
              <span slot="noResult">No Station found</span>
              <span slot="noOptions">Please type to search</span>
            </multiselect>
            <div
              v-if="$v.departureStation.PlaceName.$error"
              class="text-danger text-left"
            >
              <small v-if="!$v.departureStation.PlaceName.required"
                >Departing Station is required</small
              >
            </div>
          </div>
          <div class="form-group col-md-6">
            <label>Arrival Station</label>
            <multiselect
              v-model="arrivalStation"
              :clear-on-select="false"
              :hide-selected="true"
              :internal-search="false"
              :loading="isLoadingArrival"
              :options="stations"
              :searchable="true"
              :show-labels="false"
              label="PlaceName"
              open-direction="bottom"
              placeholder="Select Your Destination"
              track-by="PlaceId"
              @search-change="selectArrival"
            >
              <span slot="noResult">No Station found</span>
              <span slot="noOptions">Please type to search</span>
            </multiselect>

            <div
              v-if="$v.arrivalStation.PlaceName.$error"
              class="text-danger text-left"
            >
              <small v-if="!$v.arrivalStation.PlaceName.required"
                >Arrival Station is required</small
              >
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group col-md-6">
            <label>Departure Date</label>
            <Datepicker
              v-model="departureDate"
              :disabled-dates="disablePastDates"
              :input-class="dateValidate"
              format="dd MMM yyyy"
              :placeholder="$dateFns.format(new Date(), 'dd MMM yyyy')"
            ></Datepicker>
            <div v-if="$v.departureDate.$error" class="text-danger text-left">
              <small v-if="!$v.departureDate.required"
                >Departure Date is required</small
              >
            </div>
          </div>
          <div class="form-group col-md-6">
            <label>Return Date</label>
            <Datepicker
              v-model="returnDate"
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

export default {
  validations() {
    return {
      departureStation: {
        PlaceName: { required },
      },
      arrivalStation: {
        PlaceName: { required },
      },
      departureDate: { required },
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
    arrivalStation: [],
    countPress: 1,
    disablePastDates: {
      to: new Date(Date.now() - 3600 * 1000 * 24),
    },
    debounce: null,
    departureDate: '',
    departureStation: [],
    isLoadingArrival: false,
    isLoadingDepature: false,
    returnDate: '',
  }),

  computed: {
    dateValidate() {
      if (this.$v.departureDate.$error) {
        return 'form-control is-invalid'
      }

      return 'form-control'
    },
  },

  methods: {
    selectDeparture(val) {
      if (!val || this.countPress < 2) {
        this.countPress++
        return []
      }

      this.isLoadingDeparture = true

      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.$axios
          .get(`/apiservices/autosuggest/v1.0/UK/GBP/en-GB/`, {
            params: {
              query: val,
            },
          })
          .then((response) => {
            this.stations = response.data.Places
            this.isLoadingDeparture = false
            this.countPress = 1
          })
      }, 600)
    },

    selectArrival(val) {
      if (!val || this.countPress < 2) {
        this.countPress++
        return []
      }

      this.isLoadingArrival = true

      clearTimeout(this.debounce)
      this.debounce = setTimeout(() => {
        this.$axios
          .get(`/apiservices/autosuggest/v1.0/UK/GBP/en-GB/`, {
            params: {
              query: val,
            },
          })
          .then((response) => {
            this.stations = response.data.Places
            this.isLoadingArrival = false
            this.countPress = 1
          })
      }, 600)
    },

    fetchStations(val) {},

    searchFlights() {
      this.$v.$touch()

      if (this.$v.$invalid) {
        this.$toastr.e('There are some errors on the form')

        return
      }

      this.$nuxt.$loading.start()

      const payload = {
        departureId: this.departureStation.PlaceId,
        arrivalId: this.arrivalStation.PlaceId,
        departureDate: this.$dateFns.format(this.departureDate, 'yyyy-MM-dd'),
      }

      if (this.returnDate) {
        payload.returnDate = this.$dateFns.format(this.returnDate, 'yyyy-MM-dd')
      }

      this.$router.push({ path: 'listing/', query: payload })
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
