export interface ConfirmStopOverResponse {
  airSearchResults: AirSearchResults;
  hotelAvailabilityInfos: HotelAvailabilityInfos;
}

export interface HotelAvailabilityInfos {
  hotelAvailInfo: HotelAvailInfo[];
  checkIn?: string;
  checkOut?: string;
}

export interface HotelAvailInfo {
  hotelImageInfo: HotelImageInfo;
  hotelInfo: HotelInfo;
  hotelRateInfo: HotelRateInfo;
}

export interface HotelImageInfo {
  imageItems: ImageItem[];
}

export interface ImageItem {
  image?: Image;
  imageCategory?: ImageCategory;
}

export interface Image {
  url?: string;
}

export interface ImageCategory {
  description?: Description;
  code?: string;
}

export interface Description {
  text?: Text[];
}

export interface Text {
  value?: string;
}

export interface HotelInfo {
  amenities: Amenities;
  chainName?: string;
  locationInfo?: LocationInfo;
  chainCode?: string;
  propertyTypeInfo: PropertyTypeInfo;
  hotelCode: string;
  hotelName?: string;
  rating: string;
  currencyCode?: string;
  recommended?: boolean;
  free?: boolean;
  reviews: Review[];
}

export interface Review {
  rate: number;
  reviewCount: number;
  type: string;
}

export interface Amenities {
  amenity: Amenity[];
}

export interface Amenity {
  value?: string;
  code: number;
  description?: string;
  complimentaryInd?: boolean;
}

export interface LocationInfo {
  address?: Address;
  contact?: Contact;
  latitude?: string;
  longitude?: string;
}

export interface Address {
  stateProv?: StateProv;
  cityName?: CityName;
  postalCode?: string;
  addressLine1?: string;
  countryName?: CountryName;
}

export interface CityName {
  value?: string;
  cityCode?: string;
}

export interface CountryName {
  value?: string;
  code?: string;
}

export interface StateProv {
  value?: string;
  stateCode?: string;
}

export interface Contact {
  phone?: string;
  fax?: string;
}

export interface PropertyTypeInfo {
  propertyType: PropertyType[];
}

export interface PropertyType {
  code: number;
  description?: string;
}

export interface HotelRateInfo {
  rooms: Rooms;
}

export interface Rooms {
  room: Room[];
}

export interface Room {
  amenities?: Amenities;
  roomTypeCode: string;
  roomCategory?: string;
  occupancy?: Occupancy;
  roomDescription?: RoomDescription;
  ratePlans: RatePlans;
  roomType?: string;
}

export interface Occupancy {
  min?: number;
  max?: number;
}

export interface RatePlans {
  ratePlan: RatePlan[];
}

export interface RatePlan {
  availableQuantity?: number;
  rateKey?: string;
  rateInfo: RateInfo;
  mealsIncluded?: MealsIncluded;
}

export interface MealsIncluded {
  lunch?: boolean;
  breakfast?: boolean;
  dinner?: boolean;
  lunchOrDinner?: boolean;
}

export interface RateInfo {
  fees?: Fees;
  cancelPenalties?: CancelPenalties;
  taxes?: Taxes;
  taxInclusive?: boolean;
  currencyCode?: string;
  netRate: number;
  sellingRate?: number;
  hotelMandatory?: boolean;
  offers?: Offer[];
}

export interface CancelPenalties {
  cancelPenalty?: CancelPenalty[];
}

export interface CancelPenalty {
  amountPercent?: AmountPercent;
  deadline?: Deadline;
}

export interface AmountPercent {
  amount?: number;
  numberOfNights?: number;
  percent?: number;
  currencyCode?: string;
}

export interface Deadline {
  absoluteDeadline?: string;
}

export interface Fees {
  fee?: Fee[];
}

export interface Fee {
  amount?: number;
  currencyCode?: string;
}

export interface Offer {
  code?: number;
  amount?: number;
  name?: string;
}

export interface Taxes {
  tax?: Fee[];
}

export interface RoomDescription {
  name?: string;
}

// for AirSearchResult Start
export interface AirSearchResults {
  segmentContextShoppingResults: SegmentContextShoppingResults;
  searchResultMetaData: SearchResultMetaData;
  fareFamilies: FareFamily[];
  unbundledOffers: Array<DOffer[]>;
  bundledOffers: any[];
  brandedResults: BrandedResults;
  travelPartAdvisories: Array<any[]>;
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

export interface BrandedResults {
  itineraryPartBrands: Array<ItineraryPartBrand[]>;
}

export interface ItineraryPartBrand {
  itineraryPart: SegmentElement;
  brandOffers: DOffer[];
  duration: number;
  departure: string;
  arrival: string;
}

export interface DOffer {
  shoppingBasketHashCode: number;
  brandId: string;
  soldout: boolean;
  bundlePrice: {};
  availableObFees: any[];
  seatsRemaining: SeatsRemaining;
  cabinClass: string;
  offerInformation: OfferInformation;
  advisories: any[];
  total: Fare;
  taxes: Fare;
  totalMandatoryObFees: Fare;
  fare: Fare;
  itineraryPart?: ItineraryPart[];
}

export interface Fare {
  alternatives: Array<FareAlternative[]>;
}

export interface FareAlternative {
  amount: number;
  currency: string;
}

export interface ItineraryPart {
  '@type': string;
  '@id': string;
  segments: SegmentElement[];
  stops: number;
  totalDuration: number;
  connectionInformations: ConnectionInformation[];
  bookingClass: string;
  brandId: string;
  programIDs: string[];
  advisories: any[];
}

export interface ConnectionInformation {
  '@id': string;
  duration: number;
  changeOfAirport: boolean;
}

export interface SegmentElement {
  '@ref': string;
}

export interface OfferInformation {
  discounted: boolean;
  negotiated: boolean;
  negotiatedType: string;
}

export interface SeatsRemaining {
  count: number;
  lowAvailability: boolean;
}

export interface FareFamily {
  brandId: string;
  brandLabel: BrandLabel[];
  marketingTexts: BrandLabel[];
  brandAncillaries: BrandAncillaries;
  fareFamilyRemarkRPH: number;
}

export interface BrandAncillaries {
  flightAncillary: any[];
}

export interface BrandLabel {
  programId: string;
  languageId: string;
  marketingText?: string;
}

export interface SearchResultMetaData {
  branded: boolean;
  multipleDateResult: boolean;
  composedResult: boolean;
  interlineRoute: boolean;
  contextShopping: boolean;
}

export interface SegmentContextShoppingResults {
  selectedSegments: Segment[];
  onwardsSegmentOffers: OnwardsSegmentOffer[];
}

export interface OnwardsSegmentOffer {
  onwardsSegments: Segment[];
  shoppingBasketHashCode: number;
  cheapest: boolean;
  differenceFromLowestPrice: DifferenceFromLowestPrice;
}

export interface DifferenceFromLowestPrice {
  alternatives: Array<DifferenceFromLowestPriceAlternative[]>;
}

export interface DifferenceFromLowestPriceAlternative {
  amount: number;
}

export interface Segment {
  '@type': string;
  '@id': string;
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
}

export interface Flight {
  flightNumber: number;
  airlineCode: string;
  operatingAirlineCode: string;
  stopAirports: any[];
  advisories: any[];
  departureTerminal: string;
  arrivalTerminal: string;
}

export interface SegmentOfferInformation {
  flightsMiles: number;
  awardFare: boolean;
}
