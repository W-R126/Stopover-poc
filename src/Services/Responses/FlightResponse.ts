export interface FlightResponse {
  searchResultMetaData: SearchResultMetaData;
  fareFamilies: FareFamily[];
  unbundledOffers: Offer[][];
  unbundledAlternateDateOffers: Offer[][];
  bundledOffers: Offer[];
  bundledAlternateDateOffers: Offer[];
  brandedResults: BrandedResults;
  resultMapping: ResultMapping;
  advisories: Advisory[];
  travelPartAdvisories: Advisory[][];
  soldOutDatesOutbound: Date[];
  soldOutDatesInbound: Date[];
  noneScheduledDatesOutbound: Date[];
  noneScheduledDatesInbound: Date[];
  warnings: string[];
  currency: string;
  promocodeValid: boolean;
  negotiateFarePresent: boolean;
  conversionRatesFound: boolean;
  retainedItineraryPartOffer: RetainedItineraryPartOffer;
  messages: Message[];
  sessionContext: SessionContext;
}

export interface SessionContext {
  sessionId: string;
  tabSessionId: string;
}

export interface Advisory {
  level: string;
  code: string;
  imageHint: string;
  image: string;
}

export interface BrandedResults {
  itineraryPartBrands: ItineraryPartBrand[][];
}

export interface ItineraryPartBrand {
  itineraryPart: ItineraryPart;
  brandOffers: Offer[];
  duration: number;
  departure: Date;
  arrival: Date;
}

export interface Offer {
  shoppingBasketHashCode: number;
  brandId: string;
  soldout: boolean;
  bundlePrice: BundlePrice;
  previouslySelectedPrice: Price;
  availableObFees: AvailableObFee[];
  seatsRemaining: SeatsRemaining;
  itineraryPart: ItineraryPart[];
  cabinClass: string;
  identicalOffersRefs: number[];
  offerInformation: OfferInformation;
  pricedItineraryExchangeCharge: PricedItineraryExchangeCharge;
  advisories: Advisory[];
  status: string;
  departureDates: Date[];
  fare: ChangeFee;
  changeFee: ChangeFee;
  changeFeeTax: ChangeFee;
  totalMandatoryObFees: ChangeFee;
  total: ChangeFee;
  totalWithoutDiscount: ChangeFee;
  requiredMinThreshold: RequiredMinThreshold;
  priceDifference: ChangeFee;
  taxesBreakdown: TaxesBreakdown[];
  taxes: ChangeFee;
  isBundledPrice: boolean;
}

export interface AvailableObFee {
  passengerType: string;
  mandatory: Mandatory[];
  optional: Mandatory[];
}

export interface Mandatory {
  code: string;
  name: string;
  amount: ChangeFee;
}

export interface ChangeFee {
  alternatives: RequiredMinThreshold[][];
}

export interface RequiredMinThreshold {
  amount: number;
  currency: string;
}

export interface BundlePrice {
  fare: ChangeFee;
  taxes: ChangeFee;
  total: ChangeFee;
  totalWithoutDiscount: ChangeFee;
  availableObFees: AvailableObFee[];
  totalMandatoryObFees: ChangeFee;
}

export interface ItineraryPart {
  '@ref': string;
  '@id': string;
  segments: Segment[];
  stops: number;
  totalDuration: number;
  connectionInformations: ConnectionInformation[];
  bookingClass: string;
  brandId: string;
  programIDs: string[];
  programCodes: string[];
  cancelledSegments: Segment[];
  advisories: Advisory[];
}

export interface Segment {
  '@ref': string;
  '@id': string;
  segmentOfferInformation: SegmentOfferInformation;
  duration: number;
  cabinClass: string;
  equipment: string;
  aircraftLeaseText: string;
  flight: Flight;
  origin: string;
  destination: string;
  departure: Date;
  arrival: Date;
  segmentStatusCode: SegmentStatusCode;
  bookingClass: string;
  layoverDuration: number;
  previouslySelectedBookingClass: string;
  fareBasis: string;
  subjectToGovernmentApproval: boolean;
}

export interface Flight {
  flightNumber: number;
  operatingFlightNumber: number;
  airlineCode: string;
  operatingAirlineCode: string;
  disclosureAirlineCode: string;
  stopAirports: StopAirport[];
  advisories: Advisory[];
  changeOfGauge: boolean;
  departureTerminal: string;
  arrivalTerminal: string;
}

export interface StopAirport {
  airport: string;
  arrival: Date;
  departure: Date;
  elapsedTime: number;
  duration: number;
}

export interface SegmentOfferInformation {
  flightsMiles: number;
  flightAncillaries: Ancillaries;
  awardFare: boolean;
}

export interface Ancillaries {
  flightAncillary: FlightAncillary[];
}

export interface FlightAncillary {
  id: string;
  subCode: string;
}

export interface SegmentStatusCode {
  code: string;
  segmentStatus: string;
}

export interface ConnectionInformation {
  duration: number;
  changeOfAirport: boolean;
}

export interface OfferInformation {
  discounted: boolean;
  negotiated: boolean;
  negotiatedType: string;
  promotions: Promotion[];
  offerName: string;
  promotionId: string;
  promotionTag: string;
}

export interface Promotion {
  offerName: string;
  promotionId: string;
  promotionTag: string;
}

export interface Price {
  fare: ChangeFee;
  taxes: ChangeFee;
  taxesBreakdown: TaxesBreakdown[];
  totalMandatoryObFees: ChangeFee;
  changeFee: ChangeFee;
  changeFeeTax: ChangeFee;
  total: ChangeFee;
  totalWithoutDiscount: ChangeFee;
  priceDifference: ChangeFee;
  requiredMinThreshold: RequiredMinThreshold;
}

export interface TaxesBreakdown {
  label: string;
  price: ChangeFee;
}

export interface PricedItineraryExchangeCharge {
  changeFeeWaived: boolean;
  changeFeeRuleId: string;
  priceDifferenceWaived: boolean;
  priceDifferenceRuleId: string;
}

export interface SeatsRemaining {
  count: number;
  lowAvailability: boolean;
}

export interface FareFamily {
  brandId: string;
  brandLabel: BrandLabel[];
  brandText: string;
  marketingTexts: MarketingText[];
  brandAncillaries: Ancillaries;
  fareFamilyRemarkRPH: number;
}

export interface BrandLabel {
  programId: string;
  programCode: string;
  programName: string;
  programSystemCode: string;
  languageId: string;
  marketingText: string;
  brandLabelUrl: string;
}

export interface MarketingText {
  programId: string;
  languageId: string;
  marketingText: string;
}

export interface Message {
  level: string;
  code: string;
  details: any;
}

export interface ResultMapping {
  combinabilityMapping: CombinabilityMapping[];
}

export interface CombinabilityMapping {
  from: number[];
  to: number[];
  toMapping: any;
}

export interface RetainedItineraryPartOffer {
  retainedItineraryPart: ItineraryPart;
  actualPrice: Price;
}

export interface SearchResultMetaData {
  branded: boolean;
  multipleDateResult: boolean;
  composedResult: boolean;
  interlineRoute: boolean;
  contextShopping: boolean;
}
