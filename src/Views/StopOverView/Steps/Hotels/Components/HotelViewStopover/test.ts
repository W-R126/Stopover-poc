import axios from 'axios';

export const callTestApis = async (
  setReturnValue: Function, selectedNight: number,
): Promise<void> => {
  const resFlight = await axios({
    method: 'POST',
    url: 'http://40.80.199.170/api/flights',
    data: {
      searchType: 'BRANDED',
      cabinClass: 'Economy',
      itineraryParts: [
        {
          from: {
            code: 'LHR',
          },
          to: {
            code: 'SYD',
            useNearbyLocations: false,
          },
          when: {
            date: '2020-07-18',
          },
        },
      ],
      passengers: {
        ADT: 2,
        CHD: 1,
      },
      awardBooking: false,
      promoCodes: [],
      currency: 'USD',
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const resStopOverEligibility = await axios({
    method: 'POST',
    url: 'http://40.80.199.170/api/stopoverEligibility',
    data: {
      shoppingBasketHashCode: resFlight.data.unbundledOffers[0][0].shoppingBasketHashCode,
    },
    headers: {
      'Content-Type': 'application/json',
      'session-id': resFlight.headers['session-id'],
      'tab-session-id': resFlight.headers['tab-session-id'],
    },
  });
  const resStopOverConfirm = await axios({
    method: 'POST',
    url: 'http://40.80.199.170/api/confirmStopover',
    data: {
      stopoverItineraryParts: [
        {
          selectedOriginalOfferRef: resFlight.data.unbundledOffers[0][0].shoppingBasketHashCode,
          stopover: {
            airportCode: 'AUH',
            days: selectedNight === -1
              ? resStopOverEligibility.data.stopoverDays[0]
              : selectedNight,
          },
        },
      ],
    },
    headers: {
      'Content-Type': 'application/json',
      'session-id': resFlight.headers['session-id'],
      'tab-session-id': resFlight.headers['tab-session-id'],
    },
  });

  setReturnValue({
    sessionId: resFlight.headers['session-id'],
    tabSessionId: resFlight.headers['tab-session-id'],
    outboundOfferHash: resFlight.data.unbundledOffers[0][0].shoppingBasketHashCode,
    stopoverDays: resStopOverEligibility.data.stopoverDays.sort(),
    confirmStopOverResponse: resStopOverConfirm.data,
  });
};
