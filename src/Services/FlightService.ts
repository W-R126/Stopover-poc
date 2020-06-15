import BaseService from './BaseService';
import { TripSearchData } from '../Components/TripSearch/TripSearchData';
import { FlightModel } from '../Models/FlightModel';
import Utils from '../Utils';
import AirportService from './AirportService';
import { AirportModel } from '../Models/AirportModel';

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

    return this.parseFlightResponse(result.data);
  }

  private async parseFlightResponse(data: any): Promise<FlightModel[]> {
    const store: { [id: string]: any } = {};

    const reqs: Promise<any>[] = [];

    const unbundledOffers = data.unbundledOffers[0].map((uo: any) => {
      const flight = {
        cabinClass: uo.cabinClass,
        total: {
          amount: uo.total.alternatives[0][0].amount,
          currency: uo.total.alternatives[0][0].currency,
        },
        soldout: uo.soldout,
      };

      reqs.push(this.parseItineraryParts(
        uo.itineraryPart[0],
        store,
      ).then((itineraryPart) => Object.assign(flight, { itineraryPart })));

      return flight;
    });

    await Promise.all(reqs);

    return unbundledOffers;
  }

  private async parseItineraryParts(data: any, store: { [id: string]: any }): Promise<any> {
    if (data['@ref'] && store[data['@ref']] !== undefined) {
      return store[data['@ref']];
    }

    const reqs = data.segments.map(
      (segment: any) => this.parseSegment(segment, store),
    ) as Promise<any>[];

    const segments = await Promise.all(reqs);

    Object.assign(
      store,
      {
        [data['@id']]: {
          bookingClass: data.bookingClass,
          segments,
        },
      },
    );

    return store[data['@id']];
  }

  private async parseSegment(data: any, store: { [id: string]: any}): Promise<any> {
    if (data['@ref'] && store[data['@ref']] !== undefined) {
      return store[data['@ref']];
    }

    Object.assign(
      store,
      {
        [data['@id']]: {
          arrival: new Date(data.arrival),
          departure: new Date(data.departure),
          bookingClass: data.bookingClass,
          cabinClass: data.cabinClass,
          origin: data.origin ? await this.airportService.getAirport(data.origin) : undefined,
          destination:
            data.destination ? await this.airportService.getAirport(data.destination) : undefined,
          flight: {
            airlineCode: data.flight?.airlineCode,
            flightNumber: data.flight?.flightNumber,
            operatingAirlineCode: data.flight?.operatingAirlineCode,
          },
        },
      },
    );

    return store[data['@id']];
  }
}
