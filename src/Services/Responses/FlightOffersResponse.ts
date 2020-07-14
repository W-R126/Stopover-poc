export interface FlightOffersResponse {
  searchResultMetaData: SearchResultMetaData;
  fareFamilies: FareFamily[];
  unbundledOffers: UnbundledOffer[][];
  unbundledAlternateDateOffers: UnbundledAlternateDateOffer[][];
  bundledOffers: any[];
  bundledAlternateDateOffers: any[];
  brandedResults: BrandedResults;
  resultMapping: ResultMapping;
  travelPartAdvisories: any[][];
  soldOutDatesOutbound: any[];
  soldOutDatesInbound: any[];
  noneScheduledDatesOutbound: any[];
  noneScheduledDatesInbound: any[];
  warnings: any[];
  currency: string;
  promocodeValid: boolean;
  negotiateFarePresent: boolean;
  conversionRatesFound: boolean;
}

export interface SearchResultMetaData {
  branded: boolean;
  multipleDateResult: boolean;
  composedResult: boolean;
  interlineRoute: boolean;
  contextShopping: boolean;
}

export interface FareFamily {
  brandId: string;
  brandLabel: BrandLabel[];
  marketingTexts: MarketingText[];
  brandAncillaries: BrandAncillaries;
  fareFamilyRemarkRPH: number;
}

export interface BrandLabel {
  programId: string;
  languageId: string;
  marketingText: string;
}

export interface MarketingText {
  programId: string;
  languageId: string;
  marketingText?: string;
}

export interface BrandAncillaries {
  flightAncillary: any[];
}

export interface UnbundledOffer {
  shoppingBasketHashCode: number;
  brandId: string;
  soldout: boolean;
  availableObFees: any[];
  seatsRemaining: SeatsRemaining;
  itineraryPart: ItineraryPart[];
  cabinClass: string;
  offerInformation: OfferInformation;
  advisories: any[];
  total: Total;
  fare: Fare;
  taxes: Taxes;
  totalMandatoryObFees: TotalMandatoryObFees;
  identicalOffersRefs?: number[];
}

export interface SeatsRemaining {
  count: number;
  lowAvailability: boolean;
}

export interface ItineraryPart {
  '@type': string;
  '@id': string;
  segments: Segment[];
  stops: number;
  totalDuration: number;
  connectionInformations: ConnectionInformation[];
  bookingClass: string;
  brandId: string;
  programIDs: string[];
  advisories: any[];
}

export interface Segment {
  '@type'?: string;
  '@id'?: string;
  segmentOfferInformation: SegmentOfferInformation;
  duration: number;
  cabinClass: string;
  equipment: string;
  flight: Flight;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  bookingClass: string;
  layoverDuration: number;
  fareBasis: string;
  subjectToGovernmentApproval: boolean;
  '@ref'?: string;
}

export interface SegmentOfferInformation {
  flightsMiles: number;
  awardFare: boolean;
}

export interface Flight {
  flightNumber: number;
  airlineCode: string;
  operatingAirlineCode: string;
  stopAirports: any[];
  advisories: any[];
  departureTerminal?: string;
  arrivalTerminal?: string;
}

export interface ConnectionInformation {
  '@id': string;
  duration: number;
  changeOfAirport: boolean;
}

export interface OfferInformation {
  discounted: boolean;
  negotiated: boolean;
  negotiatedType: string;
  promotions: any[];
}

export interface Total {
  alternatives: Alterna[][];
}

export interface Alterna {
  amount: number;
  currency: string;
}

export interface Fare {
  alternatives: Alterna2[][];
}

export interface Alterna2 {
  amount: number;
  currency: string;
}

export interface Taxes {
  alternatives: Alterna3[][];
}

export interface Alterna3 {
  amount: number;
  currency: string;
}

export interface TotalMandatoryObFees {
  alternatives: any[];
}

export interface UnbundledAlternateDateOffer {
  brandId: string;
  soldout: boolean;
  availableObFees: any[];
  seatsRemaining: SeatsRemaining2;
  itineraryPart: ItineraryPart2[];
  cabinClass: string;
  offerInformation: OfferInformation2;
  status: string;
  departureDates: string[];
  total: Total2;
  fare: Fare2;
  taxes: Taxes2;
  totalMandatoryObFees: TotalMandatoryObFees2;
}

export interface SeatsRemaining2 {
  count: number;
  lowAvailability: boolean;
}

export interface ItineraryPart2 {
  '@type': string;
  '@id': string;
  segments: Segment2[];
  stops: number;
  totalDuration: number;
  connectionInformations: ConnectionInformation2[];
  bookingClass: string;
  brandId: string;
  programIDs: string[];
}

export interface Segment2 {
  '@type': string;
  '@id': string;
  segmentOfferInformation: SegmentOfferInformation2;
  duration: number;
  cabinClass: string;
  equipment: string;
  flight: Flight2;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  bookingClass: string;
  layoverDuration: number;
  fareBasis: string;
  subjectToGovernmentApproval: boolean;
}

export interface SegmentOfferInformation2 {
  flightsMiles: number;
  awardFare: boolean;
}

export interface Flight2 {
  flightNumber: number;
  airlineCode: string;
  operatingAirlineCode: string;
  stopAirports: any[];
  departureTerminal?: string;
  arrivalTerminal?: string;
}

export interface ConnectionInformation2 {
  '@id': string;
  duration: number;
  changeOfAirport: boolean;
}

export interface OfferInformation2 {
  discounted: boolean;
  negotiated: boolean;
  negotiatedType: string;
  promotions: any[];
}

export interface Total2 {
  alternatives: Alterna4[][];
}

export interface Alterna4 {
  amount: number;
  currency: string;
}

export interface Fare2 {
  alternatives: Alterna5[][];
}

export interface Alterna5 {
  amount: number;
  currency: string;
}

export interface Taxes2 {
  alternatives: Alterna6[][];
}

export interface Alterna6 {
  amount: number;
  currency: string;
}

export interface TotalMandatoryObFees2 {
  alternatives: any[];
}

export interface BrandedResults {
  itineraryPartBrands: ItineraryPartBrand[][];
}

export interface ItineraryPartBrand {
  itineraryPart: ItineraryPart3;
  brandOffers: BrandOffer[];
  duration: number;
  departure: string;
  arrival: string;
}

export interface ItineraryPart3 {
  '@ref': string;
}

export interface BrandOffer {
  shoppingBasketHashCode: number;
  brandId: string;
  soldout: boolean;
  availableObFees: any[];
  seatsRemaining: SeatsRemaining3;
  cabinClass: string;
  offerInformation: OfferInformation3;
  advisories: any[];
  total: Total3;
  fare: Fare3;
  taxes: Taxes3;
  totalMandatoryObFees: TotalMandatoryObFees3;
}

export interface SeatsRemaining3 {
  count: number;
  lowAvailability: boolean;
}

export interface OfferInformation3 {
  discounted: boolean;
  negotiated: boolean;
  negotiatedType: string;
  promotions: any[];
}

export interface Total3 {
  alternatives: Alterna7[][];
}

export interface Alterna7 {
  amount: number;
  currency: string;
}

export interface Fare3 {
  alternatives: Alterna8[][];
}

export interface Alterna8 {
  amount: number;
  currency: string;
}

export interface Taxes3 {
  alternatives: Alterna9[][];
}

export interface Alterna9 {
  amount: number;
  currency: string;
}

export interface TotalMandatoryObFees3 {
  alternatives: any[];
}

export interface ResultMapping {
  simplifiedRoundTripMapping: {};
  combinabilityMapping: CombinabilityMapping[];
}

export interface CombinabilityMapping {
  from: number[];
  to: number[];
}
