<template>
  <section>
    <div class="flight">
      <div class="filter-sort">
        <div class="filter">Filters</div>
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
        <template v-if="flights.Quotes.length">
          <div
            v-for="(quote, quoteIndex) in flights.Quotes"
            :key="quoteIndex"
            class="flight-box"
          >
            <input type="radio" :value="quoteIndex" :name="quoteIndex" />
            <div class="ribbon"><span>Lowest</span></div>
            <div class="flight-table">
              <div class="outbound">
                <div class="airline">{{ quote.OutboundLeg.Carrier.Name }}</div>
                <div class="departure">
                  <div class="code">
                    {{ quote.OutboundLeg.Origin.IataCode }}
                  </div>
                  <div class="name">
                    {{ quote.OutboundLeg.Origin.Name }}
                  </div>
                </div>
                <div class="image">
                  <img src="~/assets/images/plane.svg" alt="Plane" />
                  <div v-if="quote.Direct">Direct</div>
                  <div v-else>Connecting</div>
                  <div class="departureDate">
                    {{
                      $dateFns.format(
                        quote.OutboundLeg.DepartureDate,
                        'dd MMM yyyy'
                      )
                    }}
                  </div>
                </div>
                <div class="arrival">
                  <div class="code">
                    {{ quote.OutboundLeg.Destination.IataCode }}
                  </div>
                  <div class="name">
                    {{ quote.OutboundLeg.Destination.Name }}
                  </div>
                </div>
                <div class="fare">
                  {{ flights.Currencies[0].Symbol }}{{ quote.MinPrice }}
                </div>
              </div>

              <div v-if="quote.InboundLeg" class="inbound">
                <div class="airline">{{ quote.InboundLeg.Carrier.Name }}</div>
                <div class="departure">
                  <div class="code">
                    {{ quote.InboundLeg.Origin.IataCode }}
                  </div>
                  <div class="name">
                    {{ quote.InboundLeg.Origin.Name }}
                  </div>
                </div>
                <div class="image">
                  <img src="~/assets/images/plane.svg" alt="Plane" />
                  <div v-if="quote.Direct">Direct</div>
                  <div v-else>Connecting</div>
                  <div class="departureDate">
                    {{
                      $dateFns.format(
                        quote.InboundLeg.DepartureDate,
                        'dd MMM yyyy'
                      )
                    }}
                  </div>
                </div>
                <div class="arrival">
                  <div class="code">
                    {{ quote.InboundLeg.Destination.IataCode }}
                  </div>
                  <div class="name">
                    {{ quote.InboundLeg.Destination.Name }}
                  </div>
                </div>
                <div class="fare">
                  {{ flights.Currencies[0].Symbol }}{{ quote.MinPrice }}
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-flights">No Flights Found</div>
        </template>
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

  async asyncData({ $axios, query, $dateFns }) {
    /**
     * This code is supposed to loop the current date till the departure date
     *
     *
     */
    // const departureFlights = []

    // const loop = new Date(Date.now() - 3600 * 1000 * 24)
    // while (loop <= new Date(query.departureDate)) {
    //   const newDate = loop.setDate(loop.getDate() + 1)

    //   console.log()

    //   const getDepartureFlights = await $axios.get(
    //     `/apiservices/browseroutes/v1.0/PH/USD/en-US/${query.departureId}/${
    //       query.arrivalId
    //     }/${$dateFns.format(newDate, 'yyyy-MM-dd')}`
    //   )

    //   departureFlights.push(getDepartureFlights.data)
    // }

    // console.log(departureFlights)

    const returnDate = query.returnDate || ''
    const getFlights = await $axios.get(
      `/apiservices/browseroutes/v1.0/PH/USD/en-US/${query.departureId}/${query.arrivalId}/${query.departureDate}/${returnDate}`
    )

    const data = getFlights.data

    const quotes = getFlights.data.Quotes
    for (let quoteIndex = 0; quoteIndex < quotes.length; quoteIndex++) {
      // Outboud Carrier Ids
      const outboundCarrierIds = quotes[quoteIndex].OutboundLeg.CarrierIds
      for (
        let outboundCarrierIdsIndex = 0;
        outboundCarrierIdsIndex < outboundCarrierIds.length;
        outboundCarrierIdsIndex++
      ) {
        // Carrier
        const outboundCarrierId = outboundCarrierIds[outboundCarrierIdsIndex]
        quotes[quoteIndex].OutboundLeg.Carrier = getFlights.data.Carriers.find(
          (carrier) => carrier.CarrierId === outboundCarrierId
        )
      }

      // Outbound Origin
      quotes[quoteIndex].OutboundLeg.Origin = getFlights.data.Places.find(
        (places) => places.PlaceId === quotes[quoteIndex].OutboundLeg.OriginId
      )

      // Outbound Destination
      quotes[quoteIndex].OutboundLeg.Destination = getFlights.data.Places.find(
        (places) =>
          places.PlaceId === quotes[quoteIndex].OutboundLeg.DestinationId
      )

      // Inbound Carrier Id
      if (quotes[quoteIndex]?.InboundLeg) {
        const inboundCarrierIds = quotes[quoteIndex].InboundLeg.CarrierIds
        for (
          let inboundCarrierIdsIndex = 0;
          inboundCarrierIdsIndex < inboundCarrierIds.length;
          inboundCarrierIdsIndex++
        ) {
          // Carrier
          const inBoundCarrierId = inboundCarrierIds[inboundCarrierIdsIndex]
          quotes[quoteIndex].InboundLeg.Carrier = getFlights.data.Carriers.find(
            (carrier) => carrier.CarrierId === inBoundCarrierId
          )
        }

        // Inbound Origin
        quotes[quoteIndex].InboundLeg.Origin = getFlights.data.Places.find(
          (places) => places.PlaceId === quotes[quoteIndex].InboundLeg.OriginId
        )

        // Inbound Destination
        quotes[quoteIndex].InboundLeg.Destination = getFlights.data.Places.find(
          (places) =>
            places.PlaceId === quotes[quoteIndex].InboundLeg.DestinationId
        )
      }
    }

    data.Quotes = quotes

    return { flights: data }
  },

  data: () => ({
    flights: null,
  }),
}
</script>
<style lang="scss" scoped>
.flight {
  margin-top: 50px;

  h2 {
    font-family: $kautivaCyrillicBlackFont;
    font-size: clamp(20px, 7vw, 32px);
  }

  .filter-sort {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;

    .filter {
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
    margin-bottom: 50px;

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

      .ribbon {
        height: 52px;
        overflow: hidden;
        position: absolute;
        right: -6px;
        top: -6px;
        width: 72px;
        z-index: 1;

        &::before,
        &::after {
          border-right-color: transparent;
          border-top-color: transparent;
          border: 3px solid #aa1d11;
          content: '';
          display: block;
          position: absolute;
          z-index: -1;
        }

        &::before {
          left: 20px;
          top: 0;
        }

        &::after {
          bottom: 0;
          right: 0;
        }

        span {
          background-color: $primary-red;
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
          color: #fff;
          display: block;
          font: 500 10px/1 -apple-system, BlinkMacSystemFont, 'Roboto',
            'Helvetica Neue';
          left: 3px;
          padding: 5px 0;
          position: absolute;
          text-align: center;
          text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
          top: 10px;
          transform: rotate(45deg);
          width: 100px;
        }
      }

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
        background: $primary-white;
        border-radius: 12px;
        color: $primary-black;
        padding: 0 15px;
        position: relative;
        text-align: center;
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

        .inbound {
          border-top: 1px dashed $primary-grey;
        }

        .outbound,
        .inbound {
          align-items: center;
          display: flex;
          padding: 20px 0;

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
              top: 32px;
              width: 65px;
              border-top: 2px dashed $primary-grey;
              height: 1px;
            }

            &::after {
              content: '';
              position: absolute;
              right: -15%;
              top: 32px;
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

            .departureDate {
              color: $primary-black;
              font-weight: 500;
              margin-top: 0;
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
    }

    .no-flights {
      font-size: 20px;
      margin-top: 15px;
      text-align: center;
    }
  }
}

@media (max-width: 991.98px) {
  .flight-table {
    .image {
      &::before,
      &::after {
        display: none;
      }
    }
  }
}

@media (max-width: 767.98px) {
  .flight {
    .filter-sort {
      display: block;

      .filter {
        font-size: clamp(15px, 4vw, 20px);
      }

      .sort {
        margin-top: 10px;
        width: 225px;

        select {
          margin-left: 5px;
        }
      }
    }
  }
}

@media (max-width: 575.98px) {
  .flight {
    .flight-list {
      .flight-heading {
        font-size: clamp(12px, 2vw, 15px);
      }

      .flight-box {
        .flight-table {
          padding: 30px 10px;

          .outbound,
          .inbound {
            .departure,
            .arrival {
              .code {
                font-size: clamp(25px, 8vw, 35px);
              }
            }

            .image {
              img {
                width: 20px;
              }
            }

            .airline,
            .fare {
              font-size: clamp(12px, 2vw, 15px);
            }
          }
        }
      }
    }
  }
}
</style>
