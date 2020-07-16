export interface ConfirmStopOverResponse {
  airSearchResults: AirSearchResults;
  hotelAvailabilityInfos: HotelAvailabilityInfos;
}

export interface AirSearchResults {
  segmentContextShoppingResults: SegmentContextShoppingResults;
  searchResultMetaData: SearchResultMetaData;
  fareFamilies: FareFamily[];
  unbundledOffers: UnbundledOffer[][];
  bundledOffers: any[];
  brandedResults: BrandedResults;
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

export interface SegmentContextShoppingResults {
  selectedSegments: Segment[];
  onwardsSegmentOffers: OnwardsSegmentOffer[];
}

export interface Segment {
  '@type': string;
  '@id': string;
  '@ref'?: string;
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
  departureTerminal: string;
  arrivalTerminal: string;
}

export interface OnwardsSegmentOffer {
  onwardsSegments: Segment[];
  shoppingBasketHashCode: number;
  cheapest: boolean;
}

export interface Alterna {
  amount: number;
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
  languageId: string;
  marketingText: string;
}

export interface MarketingText {
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
  bundlePrice: {};
  availableObFees: any[];
  itineraryPart: ItineraryPart[];
  cabinClass: string;
  offerInformation: OfferInformation;
  advisories: any[];
  total: Pricing;
  fare: Pricing;
  taxes: Pricing;
  totalMandatoryObFees: TotalMandatoryObFees;
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

export interface ConnectionInformation {
  '@id': string;
  duration: number;
  changeOfAirport: boolean;
}

export interface OfferInformation {
  discounted: boolean;
  negotiated: boolean;
  negotiatedType: string;
}

export interface Pricing {
  alternatives: {
    amount: number;
    currency: string;
  }[][];
}

export interface TotalMandatoryObFees {
  alternatives: any[];
}

export interface BrandedResults {
  itineraryPartBrands: ItineraryPartBrand[][];
}

export interface ItineraryPartBrand {
  itineraryPart: ItineraryPart;
  brandOffers: BrandOffer[];
  duration: number;
  departure: string;
  arrival: string;
}

export interface Segment2 {
  '@type': string;
  '@id': string;
  segmentOfferInformation: SegmentOfferInformation;
  duration: number;
  cabinClass: string;
  equipment: string;
  flight: Flight3;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  bookingClass: string;
  layoverDuration: number;
  fareBasis: string;
  subjectToGovernmentApproval: boolean;
}

export interface Flight3 {
  flightNumber: number;
  airlineCode: string;
  operatingAirlineCode: string;
  stopAirports: any[];
  advisories: any[];
  departureTerminal: string;
  arrivalTerminal: string;
}

export interface BrandOffer {
  shoppingBasketHashCode: number;
  brandId: string;
  soldout: boolean;
  bundlePrice: {};
  availableObFees: any[];
  cabinClass: string;
  offerInformation: OfferInformation;
  advisories: any[];
  total: Pricing;
  fare: Pricing;
  taxes: Pricing;
}

export interface HotelAvailabilityInfos {
  hotelAvailInfo: HotelAvailInfo[];
  checkIn: string;
  checkOut: string;
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
  image: Image;
  imageCategory: ImageCategory;
}

export interface Image {
  url: string;
}

export interface ImageCategory {
  description: Description;
  code: string;
}

export interface Description {
  text: Text[];
}

export interface Text {
  value: string;
}

export interface HotelInfo {
  amenities: Amenities;
  chainName?: string;
  locationInfo: LocationInfo;
  chainCode?: string;
  propertyTypeInfo: PropertyTypeInfo;
  hotelCode: string;
  hotelName: string;
  rating: string;
  currencyCode: string;
  recommended: boolean;
  free: boolean;
  reviews: Review[];
}

export interface Amenities {
  amenity: Amenity[];
}

export interface Amenity {
  code: number;
  description: string;
  value?: string;
  complimentaryInd?: boolean;
}

export interface LocationInfo {
  address: Address;
  contact: Contact;
  latitude: string;
  longitude: string;
}

export interface Address {
  stateProv: StateProv;
  cityName: CityName;
  postalCode?: string;
  addressLine1: string;
  countryName: CountryName;
}

export interface StateProv {
  value: string;
  stateCode: string;
}

export interface CityName {
  value: string;
  cityCode: string;
}

export interface CountryName {
  value: string;
  code: string;
}

export interface Contact {
  phone: string;
  fax?: string;
}

export interface PropertyTypeInfo {
  propertyType: PropertyType[];
}

export interface PropertyType {
  code: number;
  description: string;
}

export interface Review {
  rate: number;
  reviewCount: number;
  type: string;
}

export interface HotelRateInfo {
  rooms: Rooms;
}

export interface Rooms {
  room: Room[];
}

export interface Room {
  amenities?: Amenities2;
  roomTypeCode: string;
  roomCategory: string;
  occupancy: Occupancy;
  roomDescription: RoomDescription;
  ratePlans: RatePlans;
  roomType: string;
}

export interface Amenities2 {
  amenity: Amenity2[];
}

export interface Amenity2 {
  value: string;
  code: number;
  description: string;
  complimentaryInd?: boolean;
}

export interface Occupancy {
  min: number;
  max: number;
}

export interface RoomDescription {
  name: string;
}

export interface RatePlans {
  ratePlan: RatePlan[];
}

export interface RatePlan {
  availableQuantity: number;
  rateKey: string;
  rateInfo: RateInfo;
  mealsIncluded: MealsIncluded;
}

export interface RateInfo {
  cancelPenalties: CancelPenalties;
  taxes: Taxes3;
  taxInclusive: boolean;
  currencyCode: string;
  netRate: number;
  offers?: Offer[];
  sellingRate?: number;
  hotelMandatory?: boolean;
}

export interface CancelPenalties {
  cancelPenalty: CancelPenalty[];
}

export interface CancelPenalty {
  amountPercent: AmountPercent;
  deadline: Deadline;
}

export interface AmountPercent {
  amount: number;
  currencyCode: string;
}

export interface Deadline {
  absoluteDeadline: string;
}

export interface Taxes3 {
  tax: Tax[];
}

export interface Tax {
  amount: number;
  currencyCode: string;
}

export interface Offer {
  code: number;
  amount: number;
  name: string;
}

export interface MealsIncluded {
  lunch: boolean;
  breakfast: boolean;
  dinner: boolean;
  lunchOrDinner: boolean;
}
