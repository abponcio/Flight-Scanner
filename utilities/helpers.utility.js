export const parseFlights = (flights) => {
  // Initialize data
  const data = []

  // Remove the empty quotes
  const flightsList = flights.filter((flights) => flights.Quotes.length)

  // Parse the data from skyscanner API
  for (
    let flightsListIndex = 0;
    flightsListIndex < flightsList.length;
    flightsListIndex++
  ) {
    const carriers = flightsList[flightsListIndex].Carriers
    const places = flightsList[flightsListIndex].Places
    const quotes = flightsList[flightsListIndex].Quotes

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
        quotes[quoteIndex].OutboundLeg.Carrier = carriers.find(
          (carrier) => carrier.CarrierId === outboundCarrierId
        )
      }

      // Outbound Origin
      quotes[quoteIndex].OutboundLeg.Origin = places.find(
        (places) => places.PlaceId === quotes[quoteIndex].OutboundLeg.OriginId
      )

      // Outbound Destination
      quotes[quoteIndex].OutboundLeg.Destination = places.find(
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
          quotes[quoteIndex].InboundLeg.Carrier = carriers.find(
            (carrier) => carrier.CarrierId === inBoundCarrierId
          )
        }

        // Inbound Origin
        quotes[quoteIndex].InboundLeg.Origin = places.find(
          (places) => places.PlaceId === quotes[quoteIndex].InboundLeg.OriginId
        )

        // Inbound Destination
        quotes[quoteIndex].InboundLeg.Destination = places.find(
          (places) =>
            places.PlaceId === quotes[quoteIndex].InboundLeg.DestinationId
        )
      }

      // Currencies
      quotes[quoteIndex].Currencies = flightsList[flightsListIndex].Currencies

      // Add to flights
      data.push(quotes[quoteIndex])
    }
  }

  return data
}

export const setLowestFare = (flights) => {
  return flights.map(function (flight, index) {
    if (
      flights[index].MinPrice ===
      flights.reduce((accumulator, currentValue) =>
        currentValue.MinPrice < accumulator.MinPrice
          ? currentValue
          : accumulator
      ).MinPrice
    ) {
      flights[index].lowestFare = true
    }

    flights[index].selectedFlag = index

    return flight
  })
}

export const getMinMax = (flights) => {
  if (!flights.length) {
    return {
      min: 0,
      max: 0,
    }
  }

  let min = flights[0].MinPrice
  let max = flights[0].MinPrice

  for (let i = 1, len = flights.length; i < len; i++) {
    const v = flights[i].MinPrice
    min = v < min ? v : min
    max = v > max ? v : max
  }

  return { min, max }
}
