<template>
  <section>
    <div class="flight-departure">
      <h2>Departure Flight</h2>
      <div class="routes-filter-sort">
        <div class="routes">
          <template v-if="departureFlights.Places.length">
            {{ departureFlights.Places[1].CityName }}
            <img src="~/assets/images/plane.svg" alt="Plane" />
            {{ departureFlights.Places[0].CityName }}
          </template>
        </div>
        <div class="sort">
          <div>Sort by:</div>
          <select class="custom-select">
            <option value="" selected>Price</option>
            <option value="lowest">Lowest to Highest Price</option>
            <option value="highest">Highest to Lowest</option>
          </select>
        </div>
      </div>

      <div class="flight-list">
        <div class="flight-heading box-container box-shadow">
          <div>Airline</div>
          <div>Departure</div>
          <div>&nbsp;</div>
          <div>Arrival</div>
          <div>Fare</div>
        </div>
        <template v-if="departureFlights.Quotes.length">
          <div
            v-for="(quote, quoteIndex) in departureFlights.Quotes"
            :key="quoteIndex"
            class="flight-box"
          >
            <input type="radio" :value="quoteIndex" name="deparureFlight" />
            <div class="flight-table">
              <div class="airline">{{ quote.OutboundLeg.Carrier.Name }}</div>
              <div class="departure">
                <div class="code">
                  {{ departureFlights.Places[1].IataCode }}
                </div>
                <div class="name">{{ departureFlights.Places[1].Name }}</div>
              </div>
              <div class="image">
                <img src="~/assets/images/plane.svg" alt="Plane" />
                <div v-if="quote.Direct">Direct</div>
                <div v-else>Connecting</div>
              </div>
              <div class="arrival">
                <div class="code">
                  {{ departureFlights.Places[0].IataCode }}
                </div>
                <div class="name">{{ departureFlights.Places[0].Name }}</div>
              </div>
              <div class="fare">
                {{ departureFlights.Currencies[0].Symbol }}{{ quote.MinPrice }}
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-flights">No Departure Flights Found</div>
        </template>
      </div>
    </div>

    <div v-if="returnFlights" class="flight-return">
      <h2>Return Flight</h2>
      <div class="routes-filter-sort">
        <div class="routes">Cebu to Manila</div>
        <div class="sort">
          <div>Sort by:</div>
          <select class="custom-select">
            <option selected>Lowest to Highest Price</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
      </div>

      <div class="flight-list">
        <div class="flight-heading box-container box-shadow">
          <div>Airline</div>
          <div>Departure</div>
          <div>&nbsp;</div>
          <div>Arrival</div>
          <div>Fare</div>
        </div>
        <div class="flight-box">
          <input type="radio" value="1" name="radio3" />
          <div class="flight-table">
            <div class="airline">Airline</div>
            <div class="departure">Departure</div>
            <div class="image">
              <img src="~/assets/images/plane.svg" alt="Plane" />
            </div>
            <div class="arrival">Arrival</div>
            <div class="fare">Fare</div>
          </div>
        </div>
        <div class="flight-box">
          <input type="radio" value="2" name="radio3" />
          <div class="flight-table">
            <div class="airline">Airline</div>
            <div class="departure">Departure</div>
            <div class="image">
              <img src="~/assets/images/plane.svg" alt="Plane" />
            </div>
            <div class="arrival">Arrival</div>
            <div class="fare">Fare</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  validate({ query, redirect }) {
    if (query.departureId && query.arrivalId && query.departureDate) {
      return true
    }

    redirect('/')
  },

  async asyncData({ $axios, query }) {
    const returnDate = query.returnDate || ''
    const getFlights = await $axios.get(
      `/apiservices/browseroutes/v1.0/PH/USD/en-US/${query.departureId}/${query.arrivalId}/${query.departureDate}/${returnDate}`
    )

    // https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/PH/USD/en-US/SFO-sky/JFK-sky/2020-12-26/2020-12-29

    const data = getFlights.data
    const quotes = getFlights.data.Quotes

    for (let quoteIndex = 0; quoteIndex < quotes.length; quoteIndex++) {
      // Outbound
      const outboundCarrierIds = quotes[quoteIndex].OutboundLeg.CarrierIds
      for (
        let outboundCarrierIdsIndex = 0;
        outboundCarrierIdsIndex < outboundCarrierIds.length;
        outboundCarrierIdsIndex++
      ) {
        const outboundCarrierId = outboundCarrierIds[outboundCarrierIdsIndex]
        quotes[quoteIndex].OutboundLeg.Carrier = getFlights.data.Carriers.find(
          (carrier) => carrier.CarrierId === outboundCarrierId
        )
      }

      // Inbound
      if (quotes[quoteIndex]?.InboundLeg?.CarrierIds) {
        const inboundCarrierIds = quotes[quoteIndex].InboundLeg.CarrierIds
        for (
          let inboundCarrierIdsIndex = 0;
          inboundCarrierIdsIndex < inboundCarrierIds.length;
          inboundCarrierIdsIndex++
        ) {
          const inBoundCarrierId = inboundCarrierIds[inboundCarrierIdsIndex]
          quotes[quoteIndex].InboundLeg.Carrier = getFlights.data.Carriers.find(
            (carrier) => carrier.CarrierId === inBoundCarrierId
          )
        }
      }
    }

    data.Quotes = quotes

    console.log(data)

    return { departureFlights: data }
  },

  data: () => ({
    departureFlights: null,
    returnFlights: true,
  }),
}
</script>
<style lang="scss" scoped>
.flight-departure,
.flight-return {
  margin-top: 50px;

  h2 {
    font-family: $kautivaCyrillicBlackFont;
  }

  .routes-filter-sort {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .routes {
      font-size: 20px;
      font-weight: 600;

      img {
        margin-left: 15px;
        margin-right: 15px;
        width: 25px;
      }
    }

    .sort {
      align-items: center;
      display: flex;
      justify-content: space-between;

      div {
        width: 75px;
      }
    }
  }

  .flight-list {
    .flight-heading {
      display: flex;
      padding: 12px;

      div {
        flex-basis: 100%;
        text-align: center;
        font-weight: 600;
      }
    }

    .flight-box {
      margin-top: 15px;
      position: relative;

      input {
        cursor: pointer;
        height: 100%;
        opacity: 0;
        position: absolute;
        width: 100%;
        z-index: 1;
      }

      input:checked ~ .flight-table {
        border: 2px solid $primary-black;

        &::before {
          border: 2px solid $primary-black;
          border-left-color: $primary-yellow;
        }

        &::after {
          border: 2px solid $primary-black;
          border-right-color: $primary-yellow;
        }
      }

      .flight-table {
        align-items: center;
        background: $primary-white;
        border-radius: 12px;
        color: $primary-black;
        display: flex;
        padding: 30px 15px;
        position: relative;
        text-align: center;
        text-transform: uppercase;
        width: 100%;

        &::before,
        &::after {
          background: $primary-yellow;
          content: '';
          height: 20px;

          position: absolute;
          width: 15px;
        }

        &::before {
          border-left-color: $primary-yellow;
          border-radius: 0 16px 16px 0;
          bottom: 0;
          left: -2px;
          margin-bottom: auto;
          margin-top: auto;
          top: 0;
        }

        &::after {
          border-radius: 16px 0 0 16px;
          border-right-color: $primary-yellow;
          bottom: 0;
          margin-bottom: auto;
          margin-top: auto;
          right: -2px;
          top: 0;
        }

        div {
          flex-basis: 100%;
          text-align: center;
          font-weight: 600;
        }

        .image {
          position: relative;

          &::before {
            content: '';
            position: absolute;
            left: -10%;
            top: 12px;
            width: 65px;
            border-top: 2px dashed $primary-grey;
            height: 1px;
          }

          &::after {
            content: '';
            position: absolute;
            right: -15%;
            top: 12px;
            width: 75px;
            border-top: 2px dashed $primary-grey;
            height: 1px;
          }

          img {
            position: relative;
            width: 30px;
          }

          div {
            color: $primary-green;
            font-size: 10px;
            margin-top: 5px;
          }
        }

        .departure,
        .arrival {
          .code {
            font-family: $kautivaCyrillicBlackFont;
            font-size: 40px;
            line-height: 35px;
          }

          .name {
            font-size: 12px;
            font-weight: 500;
          }
        }
      }
    }

    .no-flights {
      font-size: 20px;
      margin-top: 15px;
      text-align: center;
    }
  }
}

.flight-return {
  margin: 50px 0;
}
</style>
