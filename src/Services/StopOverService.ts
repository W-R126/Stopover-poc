import BaseService from './BaseService';
import SessionManager from '../SessionManager';
import { StopOverResponse } from './Responses/StopOverResponse';
import {
  ConfirmStopOverResponse,
  FareFamily,
  Segment,
  BrandedResults,
  BrandOffer,
  HotelAvailabilityInfos,
  ItineraryPart,
  Room,
} from './Responses/ConfirmStopOverResponse';
import { StopOverModel } from '../Models/StopOverModel';
import AirportService from './AirportService';
import ContentService from './ContentService';
import { AirportModel } from '../Models/AirportModel';
import {
  FlightOfferModel,
  LegModel,
  FareModel,
  CheapestFareModel,
} from '../Models/FlightOfferModel';
import { CabinClassEnum } from '../Enums/CabinClassEnum';
import Config from '../Config';
import {
  HotelOfferModel,
  HotelModel,
  RoomOfferModel,
  RoomModel,
} from '../Models/HotelOfferModel';
import { CustomerSegmentEnum } from '../Enums/CustomerSegment';

export default class StopOverService extends BaseService {
  private readonly airportService: AirportService;

  private readonly hotelImageBaseURL: string;

  private readonly contentService: ContentService;

  constructor(
    contentService: ContentService,
    airportService: AirportService,
    config: Config,
  ) {
    super(config);

    this.airportService = airportService;
    this.hotelImageBaseURL = config.hotelImageBaseURL ?? '';
    this.contentService = contentService;
  }

  async getStopOver(hash: number): Promise<StopOverModel | undefined> {
    try {
      const result = await this.http.post<StopOverResponse>(
        '/stopoverEligibility',
        { shoppingBasketHashCode: hash },
        { headers: SessionManager.getSessionHeaders() },
      );

      SessionManager.setSessionHeaders(result.headers);

      if (result.status === 200) {
        return {
          airportCode: result.data.airportCode,
          days: result.data.stopoverDays,
          customerSegment: CustomerSegmentEnum[
            result.data.customerSegment.toLowerCase() as keyof typeof CustomerSegmentEnum
          ],
        };
      }
    } catch (err) {
      //
    }

    return undefined;
  }

  async getOffers(
    hash: number,
    airportCode: string,
    days: number,
    outbound: Date,
    inbound?: Date,
  ): Promise<{
    flightOffers: FlightOfferModel[][];
    hotelOffers: HotelOfferModel;
  } | undefined> {
    const airportsReq = this.airportService.getAirports();
    let nextInbound;

    const minInbound = new Date(outbound);
    minInbound.setDate(minInbound.getDate() + days + 2);

    if (inbound) {
      nextInbound = minInbound > inbound ? minInbound : inbound;
    }

    const stopover = { airportCode, days };

    if (nextInbound) {
      Object.assign(stopover, { nextLegDateModifier: nextInbound.toLocaleDateString('sv-SE') });
    }

    let resp;

    try {
      const { data, headers, status } = await this.http.post<ConfirmStopOverResponse>(
        '/confirmStopover',
        {
          stopoverItineraryParts: [{
            selectedOriginalOfferRef: hash,
            stopover,
          }],
        },
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

    const { airSearchResults: flights, hotelAvailabilityInfos: hotels } = resp;
    const airports = await airportsReq;
    const flightRefs = this.getResponseRefs(flights);
    const fareFamilies = this.getFareFamilies(flights.fareFamilies);
    const flightOffers = this.getFlightOffers(
      flights.brandedResults,
      flightRefs,
      fareFamilies,
      airports,
    );

    const hotelOffers = this.getHotelOffers(hotels);

    return {
      flightOffers,
      hotelOffers,
    };
  }

  async rejectStopOver(airportCode: string): Promise<undefined> {
    try {
      const result = await this.http.post(
        '/rejectStopover',
        {
          stopover: { airportCode },
        },
        { headers: SessionManager.getSessionHeaders() },
      );

      SessionManager.setSessionHeaders(result.headers);
    } catch (err) {
      //
    }

    return undefined;
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

  private getFlightOffers(
    brandedResults: BrandedResults,
    refs: { [key: string]: any },
    fareFamilies: { [key: string]: string },
    airports: AirportModel[],
  ): FlightOfferModel[][] {
    return brandedResults.itineraryPartBrands.map(
      (ipbs): FlightOfferModel[] => ipbs.map((ipb): FlightOfferModel => {
        const legs = this.getLegs(
          (refs[ipb.itineraryPart['@id'] ?? ipb.itineraryPart['@ref']] as ItineraryPart).segments,
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
          legs,
          fareFamilies,
        );
        const cheapestFares = this.getCheapestFares(fares);

        return {
          arrival,
          departure,
          cheapestFares,
          origin,
          destination,
          duration: ipb.duration,
          fares,
          legs,
          stops: legs.slice(1).map((leg) => leg.origin.code),
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
    legs: LegModel[],
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
      legs,
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

  private getHotelOffers(hotelsInfo: HotelAvailabilityInfos): HotelOfferModel {
    const checkIn = new Date(hotelsInfo.checkIn);
    const checkOut = new Date(hotelsInfo.checkOut);

    const hotels = hotelsInfo.hotelAvailInfo.map((hotelInfo): HotelModel => {
      const images = hotelInfo.hotelImageInfo.imageItems;
      const info = hotelInfo.hotelInfo;
      const { locationInfo } = info;

      return {
        images: images.map((image) => ({
          thumb: `${this.hotelImageBaseURL}/${image.image.url}`,
          original: `${this.hotelImageBaseURL}/bigger/${image.image.url}`,
          code: image.imageCategory.code,
          description: image.imageCategory.description.text[0].value,
        })),
        rooms: this.getRoomOffers(
          hotelInfo.hotelRateInfo.rooms.room,
          checkIn,
          checkOut,
          hotelInfo.hotelInfo.hotelName,
        ),
        chain: {
          code: info.chainCode,
          name: info.chainName,
        },
        checkIn: (info.amenities.amenity.find(
          (amenity) => amenity.description === 'Check-in hour',
        )?.value ?? '').split(':').slice(0, 2).join(':'),
        checkOut: (info.amenities.amenity.find(
          (amenity) => amenity.description === 'Check-out hour',
        )?.value ?? '').split(':').slice(0, 2).join(':'),
        free: info.free,
        name: info.hotelName,
        code: info.hotelCode,
        rating: Number.parseInt(info.rating, 10),
        recommended: info.recommended,
        reviews: info.reviews.map((review) => ({
          rating: review.rate,
          count: review.reviewCount,
          type: review.type,
        })),
        categories: info.propertyTypeInfo.propertyType.map(
          (propertyType) => propertyType.description.trim(),
        ),
        coordinates: {
          lat: Number.parseFloat(locationInfo.latitude),
          long: Number.parseFloat(locationInfo.longitude),
        },
        contact: {
          phone: locationInfo.contact.phone,
          fax: locationInfo.contact.fax,
        },
        address: {
          city: {
            name: locationInfo.address.cityName.value,
            code: locationInfo.address.cityName.cityCode,
          },
          country: {
            name: locationInfo.address.countryName.value,
            code: locationInfo.address.countryName.code,
          },
          line1: locationInfo.address.addressLine1,
          state: {
            name: locationInfo.address.stateProv.value,
            code: locationInfo.address.stateProv.stateCode,
          },
        },
        amenities: info.amenities.amenity.map((amenity) => ({
          code: amenity.code,
          description: amenity.description,
          value: amenity.value,
          complimentary: amenity.complimentaryInd ?? false,
        })).filter((amenity) => amenity.value !== undefined),
      };
    });

    return {
      checkIn,
      checkOut,
      hotels,
    };
  }

  private getRoomOffers(
    rooms: Room[],
    checkIn: Date,
    checkOut: Date,
    hotelName: string,
  ): RoomModel[] {
    return rooms.map((room): RoomModel => ({
      category: room.roomCategory,
      occupancy: {
        min: room.occupancy.min,
        max: room.occupancy.max,
      },
      type: {
        name: room.roomType,
        description: room.roomDescription.name,
        code: room.roomTypeCode,
      },
      offers: room.ratePlans.ratePlan.map((ratePlan): RoomOfferModel => ({
        available: ratePlan.availableQuantity,
        hashCode: ratePlan.rateKey,
        includedMeals: {
          breakfast: ratePlan.mealsIncluded.breakfast,
          dinner: ratePlan.mealsIncluded.dinner,
          lunch: ratePlan.mealsIncluded.lunch,
          lunchOrDinner: ratePlan.mealsIncluded.lunchOrDinner,
        },
        checkIn,
        checkOut,
        hotelName,
        price: {
          total: ratePlan.rateInfo.netRate, // TODO: Add tax on top of this?
          currency: ratePlan.rateInfo.currencyCode,
          tax: ratePlan.rateInfo.taxes.tax[0].amount,
        },
        cancelPenalty: {
          price: {
            total: ratePlan.rateInfo.cancelPenalties.cancelPenalty[0].amountPercent.amount,
            currency: ratePlan.rateInfo.cancelPenalties.cancelPenalty[0]
              .amountPercent.currencyCode,
            tax: 0,
          },
          deadline: new Date(
            ratePlan.rateInfo.cancelPenalties.cancelPenalty[0]
              .deadline.absoluteDeadline.split('+')[0],
          ),
        },
        discounts: ratePlan.rateInfo.offers?.map((offer) => ({
          code: offer.code,
          name: offer.name,
          total: offer.amount,
        })) ?? [],
      })),
      amenities: room.amenities?.amenity.map((amenity) => ({
        code: amenity.code,
        complimentary: amenity.complimentaryInd ?? false,
        description: amenity.description,
        value: amenity.value,
      })) ?? [],
    }));
  }

  async getFlights(
    outboundHashCode: number,
    onwardHashCode: number,
    hotelHashCode: string,
  ): Promise<any> {
    const asd = await this.http.post(
      '/selectFlightsWithStopover',
      {
        selectFlights: [
          outboundHashCode,
          onwardHashCode,
        ],
        hotelRateKey: hotelHashCode,
      },
      {
        headers: SessionManager.getSessionHeaders(),
      },
    );

    return asd;
  }
}
