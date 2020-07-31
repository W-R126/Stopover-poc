export interface FlightOffersResponse {
  fareFamilies: FareFamily[];
  unbundledOffers: UnbundledOffer[][];
  brandedResults: BrandedResults;
  unbundledAlternateDateOffers: UnbundledAlternateDateOffer[][];
  customerSegmentation: CustomerSegmentation;
}

export interface FareFamily {
  brandId: string;
  brandLabel: BrandLabel[];
}

export interface UnbundledOffer {
  itineraryPart: ItineraryPart[];
}

export interface BrandedResults {
  itineraryPartBrands: ItineraryPartBrand[][];
}

export interface UnbundledAlternateDateOffer {
  departureDates: string[];
  status: string;
  total: Pricing;
  taxes: Pricing;
}

export interface BrandLabel {
  languageId: string;
  marketingText: string;
}

export interface ItineraryPart {
  '@id': string;
  '@ref'?: string;
  segments: Segment[];
}

export interface Segment {
  '@ref'?: string;
  '@id'?: string;
  arrival: string;
  departure: string;
  origin: string;
  destination: string;
  duration: number;
  segmentOfferInformation: SegmentOfferInformation;
  equipment: string;
  flight: Flight;
}

export interface ItineraryPartBrand {
  itineraryPart: {
    '@ref': string;
  };
  departure: string;
  arrival: string;
  brandOffers: BrandOffer[];
  duration: number;
}

export interface SegmentOfferInformation {
  flightsMiles: number;
  awardFare: boolean;
}

export interface Flight {
  flightNumber: number;
  airlineCode: string;
  operatingAirlineCode: string;
  departureTerminal?: string;
  arrivalTerminal?: string;
}

export interface BrandOffer {
  brandId: string;
  cabinClass: string;
  shoppingBasketHashCode: number;
  total: Pricing;
  taxes: Pricing;
}

export interface Pricing {
  alternatives: {
    amount: number;
    currency: string;
  }[][];
}

export interface SelectOnwardFlightAndHotelResponse {
  airSearchResults: AirSearchResults;
}

export interface AirSearchResults {
  fareFamilies: FareFamily[];
  unbundledOffers: UnbundledOffer[][];
  bundledOffers: UnbundledOffer[];
  bundledAlternateDateOffers: UnbundledOffer[];
  brandedResults: BrandedResults;
  travelPartAdvisories: any[][];
  soldOutDatesOutbound: any[];
  soldOutDatesInbound: any[];
  noneScheduledDatesOutbound: Date[];
  noneScheduledDatesInbound: Date[];
  warnings: any[];
  currency: string;
  promocodeValid: string;
  negotiateFarePresent: string;
  conversionRatesFound: string;
}

export interface CustomerSegmentation {
  id: string;
  modelType: string;
}
