import BaseService from './BaseService';
import ContentService from './ContentService';
import AirportService from './AirportService';
import { CabinClassEnum } from '../Enums/CabinClassEnum';
import { GuestsModel } from '../Models/GuestsModel';
import {
  FlightOffersResponse,
  ItineraryPartBrand,
  Segment,
  BrandOffer,
  FareFamily,
  UnbundledAlternateDateOffer,
  SelectOnwardFlightAndHotelResponse,
  ItineraryPart,
} from './Responses/FlightOffersResponse';
import SessionManager from '../SessionManager';
import {
  FlightOfferModel,
  FareModel,
  LegModel,
  CheapestFareModel,
  AlternateFlightOfferModel,
} from '../Models/FlightOfferModel';
import { AirportModel } from '../Models/AirportModel';

import { FlightOffersRequest } from './Requests/FlightOffersRequest';

export default class FlightOfferService extends BaseService {
  private readonly contentService: ContentService;

  private readonly airportService: AirportService;

  constructor(
    contentService: ContentService,
    airportService: AirportService,
    baseURL?: string,
  ) {
    super(baseURL);

    this.contentService = contentService;
    this.airportService = airportService;
  }

  async getOffers(
    passengers: GuestsModel,
    legs: {
      originCode: string;
      destinationCode: string;
      departure: Date;
    }[],
    cabinClass?: CabinClassEnum,
  ): Promise<{
    offers: FlightOfferModel[][];
    altOffers: AlternateFlightOfferModel[][];
  } | undefined> {
    const airportsReq = this.airportService.getAirports();

    const nextPassengers = {
      ADT: passengers.adults,
      CHD: passengers.children,
      INF: passengers.infants,
    };

    Object.keys(nextPassengers).forEach((key) => {
      if ((nextPassengers as { [key: string]: number })[key] === 0) {
        delete (nextPassengers as { [key: string]: number })[key];
      }
    });

    const req: FlightOffersRequest = {
      passengers: nextPassengers,
      currency: this.contentService.currency,
      searchType: 'BRANDED',
      itineraryParts: legs.map((leg) => ({
        from: { code: leg.originCode },
        to: { code: leg.destinationCode },
        when: { date: leg.departure.toLocaleDateString('sv-SE') },
      })),
    };

    switch (cabinClass) {
      case CabinClassEnum.business:
        req.cabinClass = 'Business';
        break;
      case CabinClassEnum.first:
        req.cabinClass = 'First';
        break;
      case CabinClassEnum.residence:
        req.cabinClass = 'Residence';
        break;
      case CabinClassEnum.economy:
      default:
        req.cabinClass = 'Economy';
        break;
    }

    let resp;

    try {
      const { data, headers, status } = await this.http.post<FlightOffersResponse>(
        '/flights',
        req,
        { headers: SessionManager.getSessionHeaders() },
      );

      if (status === 200) {
        resp = data;
        SessionManager.setSessionHeaders(headers);
      }
    } catch (err) {
      return undefined;
    }

    if (!resp) {
      return undefined;
    }

    const airports = await airportsReq;
    const refs = this.getResponseRefs(resp);
    const fareFamilies = this.getFareFamilies(resp.fareFamilies);
    const offers = this.getBrandedOffers(
      resp.brandedResults.itineraryPartBrands,
      refs,
      fareFamilies,
      airports,
    );
    const altOffers = this.getAltOffers(resp.unbundledAlternateDateOffers);

    return {
      offers,
      altOffers,
    };
  }

  private getFareFamilies(fareFamilies: FareFamily[]): { [key: string]: string } {
    const result: { [key: string]: string } = {};

    fareFamilies.forEach((ff) => {
      result[ff.brandId] = (ff.brandLabel.find(
        (bl) => bl.languageId.replace('_', '-') === this.contentService.locale,
      ) ?? ff.brandLabel[0]).marketingText;
    });

    return result;
  }

  private getAltOffers(
    alternateOffers: UnbundledAlternateDateOffer[][],
  ): AlternateFlightOfferModel[][] {
    return alternateOffers.map(
      (aos): (AlternateFlightOfferModel)[] => aos.map(
        (ao): AlternateFlightOfferModel | undefined => {
          if (ao.status === 'UNAVAILABLE') {
            return undefined;
          }

          try {
            return {
              departure: new Date(ao.departureDates[0]),
              price: {
                total: ao.total.alternatives[0][0].amount,
                currency: ao.total.alternatives[0][0].currency,
                tax: ao.taxes.alternatives[0][0].amount,
              },
            };
          } catch (err) {
            return undefined;
          }
        },
      ).filter((ao) => ao !== undefined) as AlternateFlightOfferModel[],
    );
  }

  private getBrandedOffers(
    itineraryPartBrands: ItineraryPartBrand[][],
    refs: { [key: string]: any },
    fareFamilies: { [key: string]: string },
    airports: AirportModel[],
  ): FlightOfferModel[][] {
    return itineraryPartBrands.map(
      (ipbs): FlightOfferModel[] => ipbs.map((ipb): FlightOfferModel => {
        const legs = this.getLegs(
          (refs[ipb.itineraryPart['@ref']] as ItineraryPart).segments,
          refs,
          airports,
        );

        const departure = new Date(ipb.departure);
        const arrival = new Date(ipb.arrival);
        const { origin } = legs[0];
        const { destination } = legs[legs.length - 1];
        const milesEarned = legs.reduce((prev, curr) => prev + curr.milesEarned, 0);
        const fares = this.getFares(
          ipb.brandOffers,
          milesEarned,
          departure,
          arrival,
          origin,
          destination,
          fareFamilies,
        );
        const cheapestFares = this.getCheapestFares(fares);

        return {
          origin,
          destination,
          arrival,
          departure,
          duration: ipb.duration,
          fares,
          legs,
          stops: legs.slice(1).map((leg) => leg.origin.code),
          cheapestFares,
        };
      }),
    );
  }

  private getCheapestFares(fares: FareModel[]): CheapestFareModel[] {
    const cheapestFares: CheapestFareModel[] = [];

    fares.forEach((fare) => {
      const item = cheapestFares.find((sa) => sa.cabinClass === fare.cabinClass);

      if (!item) {
        cheapestFares.push({
          cabinClass: fare.cabinClass,
          price: fare.price,
        });
      } else if (fare.price.total < item.price.total) {
        item.price = fare.price;
      }
    });

    return cheapestFares;
  }

  private getFares(
    offers: BrandOffer[],
    milesEarned: number,
    departure: Date,
    arrival: Date,
    origin: AirportModel,
    destination: AirportModel,
    fareFamilies: { [key: string]: string },
  ): FareModel[] {
    return offers.map((bo): FareModel => ({
      brandId: bo.brandId,
      brandLabel: fareFamilies[bo.brandId],
      cabinClass: CabinClassEnum[bo.cabinClass.toLowerCase() as keyof typeof CabinClassEnum],
      hashCode: bo.shoppingBasketHashCode,
      milesEarned,
      departure,
      arrival,
      origin,
      destination,
      price: {
        total: bo.total.alternatives[0][0].amount,
        currency: bo.total.alternatives[0][0].currency,
        tax: bo.taxes.alternatives[0][0].amount,
      },
    }));
  }

  private getLegs(
    segments: Segment[],
    segmentRefs: { [key: string]: Segment },
    airports: AirportModel[],
  ): LegModel[] {
    return segments.map((segment): LegModel => {
      const nextSegment = segment['@ref'] === undefined ? segment : segmentRefs[segment['@ref']];

      return {
        arrival: new Date(nextSegment.arrival),
        departure: new Date(nextSegment.departure),
        origin: airports.find(
          (airport) => airport.code === nextSegment.origin,
        ) as AirportModel,
        destination: airports.find(
          (airport) => airport.code === nextSegment.destination,
        ) as AirportModel,
        duration: nextSegment.duration,
        milesEarned: nextSegment.segmentOfferInformation.flightsMiles,
        flight: {
          equipment: nextSegment.equipment,
          airlineCode: nextSegment.flight.airlineCode,
          flightNumber: nextSegment.flight.flightNumber,
          operatingAirlineCode: nextSegment.flight.operatingAirlineCode,
        },
      };
    });
  }

  // for the inbound section of stopover
  async getInboundOffers(
    stopoverItineraryParts: number,
    hotelRateKey?: string,
  ): Promise<{offers: FlightOfferModel[][]}> {
    const airportsReq = this.airportService.getAirports();

    let resp;

    try {
      const { data, headers, status } = await this.http.post<SelectOnwardFlightAndHotelResponse>(
        '/selectOnwardFlightAndHotel',
        {
          stopoverItineraryParts: [{
            selectedOfferRef: stopoverItineraryParts,
          }],
          hotelRateKey,
        },
        { headers: SessionManager.getSessionHeaders() },
      );

      SessionManager.setSessionHeaders(headers);

      if (status === 200) {
        resp = data;
      }
    } catch (err) {
      return { offers: [] };
    }

    if (!resp) {
      return { offers: [] };
    }

    const airports = await airportsReq;
    const fareFamilies = this.getFareFamilies(resp.airSearchResults.fareFamilies);
    const refs = this.getResponseRefs(resp.airSearchResults);
    const offers = this.getBrandedOffers(
      resp.airSearchResults.brandedResults.itineraryPartBrands,
      refs,
      fareFamilies,
      airports,
    );

    return {
      offers,
    };
  }

  async getInboundOffersTest(
    resultData: SelectOnwardFlightAndHotelResponse,
  ): Promise<{offers: FlightOfferModel[][]}> {
    const airportsReq = this.airportService.getAirports();

    const airports = await airportsReq;
    const fareFamilies = this.getFareFamilies(resultData.airSearchResults.fareFamilies);
    const refs = this.getResponseRefs(resultData.airSearchResults);
    const offers = this.getBrandedOffers(
      resultData.airSearchResults.brandedResults.itineraryPartBrands,
      refs,
      fareFamilies,
      airports,
    );

    return {
      offers,
    };
  }
}
