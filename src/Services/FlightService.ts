import moment from 'moment-timezone';
import { AxiosResponse } from 'axios';

import BaseService from './BaseService';
import {
  OfferModel,
  GroupedOfferModel,
  AltOfferModel,
  SegmentModel,
  CabinClass,
} from '../Models/OfferModel';
import Utils from '../Utils';
import AirportService from './AirportService';
import { FlightResponse, ItineraryPart, Segment } from './Responses/FlightResponse';
import { PassengerPickerData } from '../Components/TripSearch/Components/PassengerPicker/PassengerPickerData';
import { AirportModel } from '../Models/AirportModel';
import ContentService from './ContentService';
import SessionManager from '../SessionManager';

export default class FlightService extends BaseService {
  private readonly airportService: AirportService;

  private readonly contentService: ContentService;

  constructor(airportService: AirportService, contentService: ContentService, baseURL?: string) {
    super(baseURL);

    this.airportService = airportService;
    this.contentService = contentService;
  }

  async getOffers(
    passengers: PassengerPickerData,
    outbound: {
      departure: Date;
      destination: AirportModel;
      origin: AirportModel;
    },
    inbound?: {
      departure: Date;
      destination: AirportModel;
      origin: AirportModel;
    },
    currency = 'AED',
  ): Promise<{
    altOffers: AltOfferModel[];
    offers: GroupedOfferModel[];
  }> {
    const passengerData: Partial<{ ADT: number; CHD: number; INF: number }> = {};
    const airportsReq = this.airportService.getAirports();

    if (passengers.adults > 0) {
      passengerData.ADT = passengers.adults;
    }

    if (passengers.children > 0) {
      passengerData.CHD = passengers.children;
    }

    if (passengers.infants > 0) {
      passengerData.INF = passengers.infants;
    }

    let result: AxiosResponse<FlightResponse> | undefined;

    const itineraryParts = [
      {
        from: { code: outbound.origin.code },
        to: { code: outbound.destination.code },
        when: { date: Utils.getDateString(outbound.departure) },
      },
    ];

    if (inbound) {
      itineraryParts.push({
        from: { code: inbound.origin.code },
        to: { code: inbound.destination.code },
        when: { date: Utils.getDateString(inbound.departure) },
      });
    }

    try {
      result = await this.http.post<FlightResponse>(
        '/flights',
        {
          passengers: passengerData,
          searchType: 'BRANDED',
          currency,
          itineraryParts,
        },
        { headers: SessionManager.getSessionHeaders() },
      );

      SessionManager.setSessionHeaders(result.headers);
    } catch (err) {
      //
    }

    if (!result) {
      return { altOffers: [], offers: [] };
    }

    const altOffers = result.data.unbundledAlternateDateOffers[0]
      .filter((altOffer) => altOffer.status === 'AVAILABLE')
      .map((altOffer) => ({
        departure: new Date(altOffer.departureDates[0]),
        total: {
          amount: altOffer.total.alternatives[0][0].amount,
          tax: altOffer.taxes.alternatives[0][0].amount,
          currency: altOffer.total.alternatives[0][0].currency,
        },
      }));

    const offers = result.data.unbundledOffers[0];
    const { fareFamilies } = result.data;
    const store: { [key: string]: any } = {};
    const flightModels = await this.contentService.get('flightModels');
    const airports = await airportsReq;

    const parsedOffers: OfferModel[] = offers.map((offer) => ({
      basketHash: offer.shoppingBasketHashCode,
      cabinClass: offer.cabinClass,
      soldout: offer.soldout,
      brandLabel: fareFamilies
        .find((ff) => ff.brandId === offer.brandId)?.brandLabel
        .find((bl) => bl.languageId === 'en_GB')?.marketingText ?? 'Unknown',
      total: {
        amount: offer.total.alternatives[0][0].amount,
        tax: offer.taxes.alternatives[0][0].amount,
        currency: offer.total.alternatives[0][0].currency,
      },
      itineraryPart: this.getItineraryPart(
        offer.itineraryPart[0],
        flightModels,
        airports,
        store,
      ),
    }));

    return {
      altOffers,
      offers: this.groupOffers(parsedOffers),
    };
  }

  private groupOffers(offers: OfferModel[]): GroupedOfferModel[] {
    const result: {
      [key: string]: GroupedOfferModel;
    } = {};

    offers.forEach((offer) => {
      let identifier = '';

      offer.itineraryPart.segments.forEach((segment) => {
        identifier += `${segment.origin.code};${segment.destination.code};${
          segment.departure};${segment.arrival}`;
      });

      if (Object.keys(result).indexOf(identifier) !== -1) {
        // Unique offer.
        if (!(result[identifier].cabinClasses as any)[offer.cabinClass]) {
          // Cabin class is not yet added.
          (result[identifier].cabinClasses as any)[offer.cabinClass] = {
            startingFrom: offer.total,
            offers: [offer],
          };
        } else {
          // Cabin class already added.
          const cabinClass: CabinClass = (
            result[identifier].cabinClasses as any
          )[offer.cabinClass];

          if (
            cabinClass.offers.findIndex(
              (nextOffer) => nextOffer
                .itineraryPart
                .bookingClass === offer.itineraryPart.bookingClass
              && nextOffer.total.amount === offer.total.amount,
            ) === -1
          ) {
            // Unqique price/booking class, add it.
            cabinClass.offers.push(offer);
          }

          if (offer.total.amount < cabinClass.startingFrom.amount) {
            // Lowest price.
            cabinClass.startingFrom = offer.total;
          }
        }

        return;
      }

      const startSegment = offer.itineraryPart.segments[0];
      const endSegment = offer.itineraryPart.segments[offer.itineraryPart.segments.length - 1];

      result[identifier] = {
        segments: offer.itineraryPart.segments,
        cabinClasses: { [offer.cabinClass]: { offers: [offer], startingFrom: offer.total } },
        departure: startSegment.departure,
        arrival: endSegment.arrival,
        origin: startSegment.origin,
        destination: endSegment.destination,
        stops: offer.itineraryPart.segments.slice(1).map((segment) => segment.origin.code),
      };
    });

    return Object.keys(result).map((key) => result[key]);
  }

  private getItineraryPart(
    data: ItineraryPart,
    flightModels: { [key: string]: string },
    airports: AirportModel[],
    store: { [key: string]: any },
  ): {
    bookingClass: string;
    type: string;
    segments: SegmentModel[];
    milesEarned: number;
  } {
    if (data['@ref'] !== undefined) {
      if (!store[data['@ref']]) {
        Object.assign(store, { [data['@ref']]: {} });
      }

      return store[data['@ref']];
    }

    const segments = data.segments.map((segment) => this.getSegment(
      segment,
      flightModels,
      airports,
      store,
    ));

    return Object.assign(store, {
      [data['@id']]: {
        bookingClass: data.bookingClass,
        type: 'itinerary',
        segments,
        milesEarned: segments.reduce(
          (prev, curr) => prev + curr.milesEarned,
          0,
        ),
      },
    })[data['@id']];
  }

  private getSegment(
    data: Segment,
    flightModels: { [key: string]: string },
    airports: AirportModel[],
    store: { [key: string]: any },
  ): {
    type: string;
    arrival: Date;
    departure: Date;
    cabinClass: string;
    bookingClass: string;
    origin: AirportModel;
    destination: AirportModel;
    equipment: string;
    milesEarned: number;
    flight: {
      airlineCode: string;
      flightNumber: number;
      operatingAirlineCode: string;
    };
  } {
    if (data['@ref'] !== undefined) {
      if (!store[data['@ref']]) {
        Object.assign(store, { [data['@ref']]: {} });
      }

      return store[data['@ref']];
    }

    const origin = airports.find((airport) => airport.code === data.origin);
    const destination = airports.find((airport) => airport.code === data.destination);
    const departure = moment.tz(data.departure, origin?.timeZone ?? '').toDate();
    const arrival = moment.tz(data.arrival, destination?.timeZone ?? '').toDate();

    return Object.assign(store, {
      [data['@id']]: {
        type: 'segment',
        arrival,
        departure,
        cabinClass: data.cabinClass,
        bookingClass: data.bookingClass,
        origin,
        destination,
        equipment: flightModels[data.equipment] ?? 'N/A',
        milesEarned: data.segmentOfferInformation.flightsMiles,
        flight: {
          airlineCode: data.flight.airlineCode,
          flightNumber: data.flight.flightNumber,
          operatingAirlineCode: data.flight.operatingAirlineCode,
        },
      },
    })[data['@id']];
  }
}
