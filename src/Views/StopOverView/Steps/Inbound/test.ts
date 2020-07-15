import axios from 'axios';
import { SelectOnwardFlightAndHotelResponse }
  from
  '../../../../Services/Responses/FlightOffersResponse';

export const callTestApis = async (): Promise<
{selectOnwardFlightAndHotelResponse: SelectOnwardFlightAndHotelResponse}
> => {
  const resFlight = await axios({
    method: 'POST',
    url: 'http://40.80.199.170/api/flights',
    data: {
      cabinClass: 'Economy',
      searchType: 'BRANDED',
      itineraryParts: [{
        from: {
          code: 'DUB',
          useNearbyLocations: false,
        },
        to: {
          code: 'COK',
          useNearbyLocations: false,
        },
        when: {
          date: '2020-07-14',
        },
      },
      {
        from: {
          code: 'COK',
          useNearbyLocations: false,
        },
        to: {
          code: 'DUB',
          useNearbyLocations: false,
        },
        when: {
          date: '2020-07-28',
        },
      },
      ],
      passengers: {
        ADT: 1,
      },
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
            days: resStopOverEligibility.data.stopoverDays[0],
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

  const resSelectOnwardFlightAndHotel = await axios({
    method: 'POST',
    url: 'http://40.80.199.170/api/selectOnwardFlightAndHotel',
    data: {
      stopoverItineraryParts: [
        {
          selectedOfferRef: resStopOverConfirm.data.airSearchResults.segmentContextShoppingResults.onwardsSegmentOffers[0].shoppingBasketHashCode,
        },
      ],
      hotelRateKey: resStopOverConfirm.data.hotelAvailabilityInfos.hotelAvailInfo[0].hotelRateInfo.rooms.room[0].ratePlans.ratePlan[0].rateKey,
    },
    headers: {
      'Content-Type': 'application/json',
      'session-id': resFlight.headers['session-id'],
      'tab-session-id': resFlight.headers['tab-session-id'],
    },
  });

  return {
    selectOnwardFlightAndHotelResponse: resSelectOnwardFlightAndHotel.data,
  };
};
