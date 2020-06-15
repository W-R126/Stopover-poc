import BaseService from './BaseService';
import { TripSearchData } from '../Components/TripSearch/TripSearchData';
import { FlightModel } from '../Models/FlightModel';
import Utils from '../Utils';
import AirportService from './AirportService';

export default class FlightService extends BaseService {
  private readonly airportService: AirportService;

  constructor(airportService: AirportService, baseURL?: string) {
    super(baseURL);

    this.airportService = airportService;
  }

  async getFlights(tripSearchData: TripSearchData): Promise<FlightModel[]> {
    // await new Promise((resolve) => setTimeout(resolve, 2000));

    const { origin, destination } = tripSearchData.originDestination;
    const { start } = tripSearchData.dates;

    if (!(origin && destination && start)) {
      return [];
    }

    const { adults, children, infants } = tripSearchData.passengers;
    const passengers = {};

    if (adults > 0) {
      Object.assign(passengers, { ADT: adults });
    }

    if (children > 0) {
      Object.assign(passengers, { CHD: children });
    }

    if (infants > 0) {
      Object.assign(passengers, { INF: infants });
    }

    const result = await this.http.post(
      'http://40.80.199.170/flights',
      {
        passengers,
        searchType: 'BRANDED',
        itineraryParts: [
          {
            from: {
              code: origin.code,
            },
            to: {
              code: destination.code,
            },
            when: {
              date: Utils.getDateString(start),
            },
          },
        ],
      },
    );

    const offers = result.data.unbundledOffers[0];
    const store: { [key: string]: any } = {};

    const parsedOffers = offers.map((offer: any) => ({
      cabinClass: offer.cabinClass,
      soldout: offer.soldout,
      total: {
        amount: offer.total.alternatives[0][0].amount,
        currency: offer.total.alternatives[0][0].currency,
      },
      itineraryPart: this.getItineraryPart(offer.itineraryPart[0], store),
    }));

    const airportReqs = Object.keys(store)
      .filter((key) => store[key].type === 'segment')
      .map((key) => this.populateAirports(store[key]));

    await Promise.all(airportReqs);

    console.log(parsedOffers);

    return parsedOffers;
  }

  private async populateAirports(data: any): Promise<void> {
    if (!data.origin) {
      Object.assign(data, { origin: await this.airportService.getAirport(data.originCode) });
    }

    if (!data.destination) {
      Object.assign(
        data,
        { destination: await this.airportService.getAirport(data.destinationCode) },
      );
    }
  }

  private getItineraryPart(data: any, store: { [key: string]: any }): any {
    if (data['@ref'] !== undefined) {
      if (!store[data['@ref']]) {
        Object.assign(store, { [data['@ref']]: {} });
      }

      return store[data['@ref']];
    }

    const segments = data.segments.map((segment: any) => this.getSegment(segment, store));

    return Object.assign(store, {
      [data['@id']]: {
        bookingClass: data.bookingClass,
        type: 'itinerary',
        segments,
      },
    })[data['@id']];
  }

  private getSegment(data: any, store: { [key: string]: any }): any {
    if (data['@ref'] !== undefined) {
      if (!store[data['@ref']]) {
        Object.assign(store, { [data['@ref']]: {} });
      }

      return store[data['@ref']];
    }

    return Object.assign(store, {
      [data['@id']]: {
        type: 'segment',
        arrival: new Date(data.arrival),
        departure: new Date(data.departure),
        cabinClass: data.cabinClass,
        bookingClass: data.bookingClass,
        destinationCode: data.destination,
        originCode: data.origin,
        flight: {
          airlineCode: data.flight.airlineCode,
          flightNumber: data.flight.flightNumber,
          operatingAirlineCode: data.flight.operatingAirlineCode,
        },
      },
    })[data['@id']];
  }
}
