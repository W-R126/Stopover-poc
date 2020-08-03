export interface Root {
  IATA_AirShoppingRS: IataAirShoppingRs;
}

export interface IataAirShoppingRs {
  Response: Response;
  AugmentationPoint?: AugmentationPoint;
}

export interface Response {
  DataLists: DataLists;
  OffersGroup: OffersGroup;
  ShoppingResponse: ShoppingResponse;
}

export interface DataLists {
  OriginDestList: OriginDestList;
  PaxJourneyList: PaxJourneyList;
  PaxList: PaxList;
  PaxSegmentList: PaxSegmentList;
  PriceClassList: PriceClassList;
  ServiceDefinitionList: ServiceDefinitionList;
}

export interface OriginDestList {
  OriginDest: OriginDest[];
}

export interface OriginDest {
  DestCode: string;
  OriginCode: string;
  OriginDestID: string;
  PaxJourneyRefID: string;
}

export interface PaxJourneyList {
  PaxJourney: PaxJourney[] | PaxJourney;
}

export interface PaxJourney {
  Duration: string;
  PaxJourneyID: string;
  PaxSegmentRefID: string|string[];
}

export interface PaxList {
  Pax: Pax[] | Pax;
}

export interface Pax {
  PaxID: string;
  PTC: string;
}

export interface PaxSegmentList {
  PaxSegment: PaxSegment[]|PaxSegment;
}

export interface PaxSegment {
  Arrival: Arrival;
  CabinType: CabinType;
  DatedOperatingLeg: DatedOperatingLeg;
  Dep: Dep2;
  Duration: string;
  MarketingCarrierInfo: MarketingCarrierInfo;
  OperatingCarrierInfo: OperatingCarrierInfo;
  PaxSegmentID: string;
}

export interface Arrival {
  AircraftScheduledDateTime: string;
  IATA_LocationCode: string;
  TerminalName: string;
}

export interface CabinType {
  CabinTypeCode: string;
  CabinTypeName: string;
}

export interface DatedOperatingLeg {
  Arrival: Arrival2;
  CarrierAircraftType: CarrierAircraftType;
  DatedOperatingLegID: string;
  Dep: Dep;
}

export interface Arrival2 {
  AircraftScheduledDateTime: string;
  IATA_LocationCode: string;
  TerminalName: string;
}

export interface CarrierAircraftType {
  CarrierAircraftTypeCode: string;
  CarrierAircraftTypeName: string;
}

export interface Dep {
  AircraftScheduledDateTime: string;
  IATA_LocationCode: string;
  TerminalName: string;
}

export interface Dep2 {
  AircraftScheduledDateTime: string;
  IATA_LocationCode: string;
  TerminalName: string;
}

export interface MarketingCarrierInfo {
  CarrierDesigCode: string;
  CarrierName: string;
  MarketingCarrierFlightNumberText: string;
}

export interface OperatingCarrierInfo {
  CarrierDesigCode: string;
  CarrierName: string;
  OperatingCarrierFlightNumberText: string;
}

export interface PriceClassList {
  PriceClass: PriceClass;
}

export interface PriceClass {
  Code: string;
  Desc: Desc[];
  Name: string;
  PriceClassID: string;
}

export interface Desc {
  DescText: string;
}

export interface ServiceDefinitionList {
  ServiceDefinition: ServiceDefinition;
}

export interface ServiceDefinition {
  BookingInstructions: BookingInstructions;
  Desc: Desc2;
  Name: string;
  ServiceDefinitionID: string;
}

export interface BookingInstructions {
  MethodText: string;
}

export interface Desc2 {
  DescText: string;
}

export interface OffersGroup {
  AllOffersSummary: AllOffersSummary;
  CarrierOffers: CarrierOffers;
}

export interface AllOffersSummary {
  MatchedOfferQty: string;
}

export interface CarrierOffers {
  CarrierOffersSummary: CarrierOffersSummary;
  Offer: Offer[];
  PriceCalendar: PriceCalendar[];
}

export interface CarrierOffersSummary {
  HighestOfferPrice: HighestOfferPrice;
  LowestOfferPrice: LowestOfferPrice;
  MatchedOfferQty: string;
}

export interface HighestOfferPrice {
  TotalAmount: string;
}

export interface LowestOfferPrice {
  TotalAmount: string;
}

export interface Offer {
  JourneyOverview: JourneyOverview;
  OfferID: string;
  OfferItem: OfferItem;
  OwnerCode: string;
  TotalPrice: TotalPrice;
  ValidatingCarrierCode: string;
}

export interface JourneyOverview {
  JourneyPriceClass: JourneyPriceClass;
}

export interface JourneyPriceClass {
  PaxJourneyRefID: string;
  PriceClassRefID: string;
}

export interface OfferItem {
  FareDetail: FareDetail;
  OfferItemID: string;
  OfferItemPaymentTimeLimit: OfferItemPaymentTimeLimit;
  Price: Price2;
  Service: Service;
}

export interface FareDetail {
  FareComponent: FareComponent;
  FarePriceType: FarePriceType;
  PaxRefID: string[];
}

export interface FareComponent {
  CabinType: CabinType2;
  FareBasisCode: string;
  FareTypeCode: string;
  PaxSegmentRefID: string[];
  PriceClassRefID: string;
  RBD: Rbd;
  TicketDesigCode: string;
}

export interface CabinType2 {
  CabinTypeCode: string;
  CabinTypeName: string;
}

export interface Rbd {
  RBD_Code: string;
}

export interface FarePriceType {
  FarePriceTypeCode: string;
  Price: Price;
}

export interface Price {
  BaseAmount: string;
  TaxSummary: TaxSummary;
  TotalAmount: string;
}

export interface TaxSummary {
  TotalTaxAmount: string;
}

export interface OfferItemPaymentTimeLimit {
  PaymentTimeLimitDate: PaymentTimeLimitDate;
}

export interface PaymentTimeLimitDate {
  PaymentTimeLimitDateTime: string;
}

export interface Price2 {
  BaseAmount: string;
  TaxSummary: TaxSummary2;
  TotalAmount: string;
}

export interface TaxSummary2 {
  TotalTaxAmount: string;
}

export interface Service {
  PaxRefID: string[];
  ServiceAssociations: ServiceAssociations;
  ServiceID: string;
}

export interface ServiceAssociations {
  ServiceDefinitionRef: ServiceDefinitionRef;
}

export interface ServiceDefinitionRef {
  PaxSegmentRefID: string[];
  ServiceDefinitionFlightAssociations: ServiceDefinitionFlightAssociations;
  ServiceDefinitionRefID: string;
}

export interface ServiceDefinitionFlightAssociations {
  DatedOperatingLegRef: DatedOperatingLegRef;
}

export interface DatedOperatingLegRef {
  DatedOperatingLegRefID: string;
}

export interface TotalPrice {
  BaseAmount: string;
  TaxSummary: TaxSummary3;
  TotalAmount: string;
}

export interface TaxSummary3 {
  TotalTaxAmount: string;
}

export interface PriceCalendar {
  LeadPriceInd: string;
  PriceCalendarDate: PriceCalendarDate;
  TotalPriceAmount: string;
}

export interface PriceCalendarDate {
  Date: string;
  OriginDestRefID: string;
}

export interface ShoppingResponse {
  ShoppingResponseRefID: string;
}

export interface AugmentationPoint {
  'ns1:ExperienceList': Ns1ExperienceList;
  'ns1:HotelList': Ns1HotelList;
}

export interface Ns1ExperienceList {
  'ns1:Experience': Ns1Experience;
}

export interface Ns1Experience {
  'ns1:Availabilities': Ns1Availabilities;
  'ns1:ExperienceOfferId': string;
  'ns1:Product': Ns1Product;
}

export interface Ns1Availabilities {
  'ns1:Items': Item[];
  'ns1:TotalItems': string;
}

export interface Item {
  'ns1:AvailabilityActive': string;
  'ns1:AvailabilityCapacityId': string;
  'ns1:AvailabilityCreated': string;
  'ns1:AvailabilityDuration': string;
  'ns1:AvailabilityFromDateTime': string;
  'ns1:AvailabilityId': string;
  'ns1:AvailabilityModified': string;
  'ns1:AvailabilityProductId': string;
  'ns1:AvailabilityToDateTime': string;
}

export interface Ns1Product {
  'ns1:ProductAdmissionType': string;
  'ns1:ProductAvailability': string;
  'ns1:ProductBookingAdvanceTimeMin': string;
  'ns1:ProductBookingStartDate': string;
  'ns1:ProductCancellationAllowed': string;
  'ns1:ProductCancellationPolicies': Ns1ProductCancellationPolicies;
  'ns1:ProductCapacityType': string;
  'ns1:ProductCategories': string;
  'ns1:ProductCodeSettings': Ns1ProductCodeSettings;
  'ns1:ProductContent': Ns1ProductContent;
  'ns1:ProductContentLanguages': string;
  'ns1:ProductCreated': string;
  'ns1:ProductDefaultLanguage': string;
  'ns1:ProductDistributorId': string;
  'ns1:ProductDistributorName': string;
  'ns1:ProductDuration': string;
  'ns1:ProductEndDate': string;
  'ns1:ProductFromPrice': string;
  'ns1:ProductId': string;
  'ns1:ProductLanguages': string[];
  'ns1:ProductLocations': Ns1ProductLocations;
  'ns1:ProductModified': string;
  'ns1:ProductNoshowPolicy': Ns1ProductNoshowPolicy;
  'ns1:ProductPastDateBookingAllowed': string;
  'ns1:ProductPaymentDetail': Ns1ProductPaymentDetail;
  'ns1:ProductPickupPoint': string;
  'ns1:ProductRedemptionRules': Ns1ProductRedemptionRules;
  'ns1:ProductSourceName': string;
  'ns1:ProductStartDate': string;
  'ns1:ProductSupplierId': string;
  'ns1:ProductTypeSeasons': Ns1ProductTypeSeasons;
}

export interface Ns1ProductCancellationPolicies {
  'ns1:CancellationDescription': string;
  'ns1:CancellationFeeThreshold': string;
  'ns1:CancellationType': string;
}

export interface Ns1ProductCodeSettings {
  'ns1:ProductCodeFormat': string;
  'ns1:ProductCodeSource': string;
  'ns1:ProductVoucherSettings': string;
}

export interface Ns1ProductContent {
  'ns1:ProductAdditionalInformation': string;
  'ns1:ProductDurationText': string;
  'ns1:ProductEntryNotes': string;
  'ns1:ProductExcludes': Ns1ProductExcludes;
  'ns1:ProductHighlights': ProductHighlight[];
  'ns1:ProductImages': ProductImage[] | ProductImage;
  'ns1:ProductIncludes': Ns1ProductIncludes;
  'ns1:ProductLongDescription': string;
  'ns1:ProductShortDescription': string;
  'ns1:ProductSupplierName': string;
  'ns1:ProductTitle': string;
}

export interface Ns1ProductExcludes {
  'ns1:ExcludeDescription': string;
}

export interface ProductHighlight {
  'ns1:HighlightDescription': string;
}

export interface ProductImage {
  'ns1:ImageType': string;
  'ns1:ImageUrl': string;
}

export interface Ns1ProductIncludes {
  'ns1:IncludeDescription': string;
}

export interface Ns1ProductLocations {
  'ns1:LocationAddress': Ns1LocationAddress;
  'ns1:LocationDescription': string;
  'ns1:LocationId': string;
  'ns1:LocationName': string;
  'ns1:LocationType': string;
}

export interface Ns1LocationAddress {
  'ns1:Country': string;
  'ns1:CountryCode': string;
  'ns1:Latitude': string;
  'ns1:Longitude': string;
  'ns1:Name': string;
  'ns1:Notes': string;
}

export interface Ns1ProductNoshowPolicy {
  'ns1:FeePercentage': string;
}

export interface Ns1ProductPaymentDetail {
  'ns1:ProductPaymentCurrency': Ns1ProductPaymentCurrency;
}

export interface Ns1ProductPaymentCurrency {
  'ns1:CurrencyCode': string;
}

export interface Ns1ProductRedemptionRules {
  'ns1:RedemptionCountType': string;
  'ns1:RedemptionCountValue': string;
}

export interface Ns1ProductTypeSeasons {
  'ns1:ProductTypeSeasonDetails': ProductTypeSeasonDetail[];
  'ns1:ProductTypeSeasonEndDate': string;
  'ns1:ProductTypeSeasonStartDate': string;
}

export interface ProductTypeSeasonDetail {
  'ns1:ProductType': string;
  'ns1:ProductTypeAgeFrom': string;
  'ns1:ProductTypeAgeTo': string;
  'ns1:ProductTypeId': string;
  'ns1:ProductTypeLabel': string;
  'ns1:ProductTypePax': string;
  'ns1:ProductTypePriceTaxId': string;
  'ns1:ProductTypePriceType': string;
  'ns1:ProductTypePricing': Ns1ProductTypePricing;
}

export interface Ns1ProductTypePricing {
  'ns1:ProductTypeDiscount': string;
  'ns1:ProductTypeListPrice': string;
  'ns1:ProductTypeResalePrice': string;
  'ns1:ProductTypeSalesPrice': string;
}

export interface Ns1HotelList {
  'ns1:Hotel': Ns1Hotel;
}

export interface Ns1Hotel {
  'ns1:Checkin': string;
  'ns1:Checkout': string;
  'ns1:HotelOfferId': string;
  'ns1:ImageBaseUrl': string;
  'ns1:Images': Ns1Images;
  'ns1:Info': Ns1Info;
  'ns1:Room': Ns1Room;
}

export interface Ns1Images {
  'ns1:Image': Ns1Image[];
}

export interface Ns1Image {
  'ns1:Image': Ns1Image2;
  'ns1:ImageCategory': Ns1ImageCategory;
}

export interface Ns1Image2 {
  'ns1:Url': string;
}

export interface Ns1ImageCategory {
  'ns1:Code': string;
  'ns1:Description': Ns1Description;
}

export interface Ns1Description {
  'ns1:Text': Ns1Text;
}

export interface Ns1Text {
  'ns1:Value': string;
}

export interface Ns1Info {
  'ns1:Amenities': Ns1Amenities;
  'ns1:ChainCode': string;
  'ns1:ChainName': string;
  'ns1:CurrencyCode': string;
  'ns1:Free': string;
  'ns1:HotelCode': string;
  'ns1:HotelName': string;
  'ns1:LocationInfo': Ns1LocationInfo;
  'ns1:PropertyTypeInfo': Ns1PropertyTypeInfo;
  'ns1:Rating': string;
  'ns1:Recommended': string;
  'ns1:Reviews': Review[];
}

export interface Ns1Amenities {
  'ns1:Amenity': Ns1Amenity[];
}

export interface Ns1Amenity {
  'ns1:Code': string;
  'ns1:Description': string;
  'ns1:Value'?: string;
  'ns1:ComplimentaryInd'?: string;
}

export interface Ns1LocationInfo {
  'ns1:Address': Ns1Address;
  'ns1:Contact': Ns1Contact;
  'ns1:Latitude': string;
  'ns1:Longitude': string;
}

export interface Ns1Address {
  'ns1:AddressLine1': string;
  'ns1:CityName': Ns1CityName;
  'ns1:CountryName': Ns1CountryName;
  'ns1:StateProv': Ns1StateProv;
}

export interface Ns1CityName {
  'ns1:CityCode': string;
  'ns1:Value': string;
}

export interface Ns1CountryName {
  'ns1:Code': string;
  'ns1:Value': string;
}

export interface Ns1StateProv {
  'ns1:StateCode': string;
  'ns1:Value': string;
}

export interface Ns1Contact {
  'ns1:Fax': string;
  'ns1:Phone': string;
}

export interface Ns1PropertyTypeInfo {
  'ns1:PropertyType': Ns1PropertyType[];
}

export interface Ns1PropertyType {
  'ns1:Code': string;
  'ns1:Description': string;
}

export interface Review {
  'ns1:Rate': string;
  'ns1:ReviewCount': string;
  'ns1:Type': string;
}

export interface Ns1Room {
  'ns1:Amenities': Ns1Amenities2;
  'ns1:Occupancy': Ns1Occupancy;
  'ns1:RatePlans': Ns1RatePlans;
  'ns1:RoomCategory': string;
  'ns1:RoomDescription': Ns1RoomDescription;
  'ns1:RoomType': string;
  'ns1:RoomTypeCode': string;
}

export interface Ns1Amenities2 {
  'ns1:Amenity': Ns1Amenity2[];
}

export interface Ns1Amenity2 {
  'ns1:Code': string;
  'ns1:ComplimentaryInd'?: string;
  'ns1:Description': string;
  'ns1:Value': string;
}

export interface Ns1Occupancy {
  'ns1:Max': string;
  'ns1:Min': string;
}

export interface Ns1RatePlans {
  'ns1:RatePlan': Ns1RatePlan;
}

export interface Ns1RatePlan {
  'ns1:AvailableQuantity': string;
  'ns1:MealsIncluded': Ns1MealsIncluded;
  'ns1:RateInfo': Ns1RateInfo;
  'ns1:RateKey': string;
}

export interface Ns1MealsIncluded {
  'ns1:Breakfast': string;
  'ns1:Dinner': string;
  'ns1:Lunch': string;
  'ns1:LunchOrDinner': string;
}

export interface Ns1RateInfo {
  'ns1:CancelPenalties': Ns1CancelPenalties;
  'ns1:CurrencyCode': string;
  'ns1:NetRate': string;
  'ns1:Offers': Ns1Offers;
  'ns1:TaxInclusive': string;
  'ns1:Taxes': Ns1Taxes;
}

export interface Ns1CancelPenalties {
  'ns1:CancelPenalty': Ns1CancelPenalty;
}

export interface Ns1CancelPenalty {
  'ns1:AmountPercent': Ns1AmountPercent;
  'ns1:Deadline': Ns1Deadline;
}

export interface Ns1AmountPercent {
  'ns1:Amount': string;
  'ns1:CurrencyCode': string;
}

export interface Ns1Deadline {
  'ns1:AbsoluteDeadline': string;
}

export interface Ns1Offers {
  'ns1:Amount': string;
  'ns1:Code': string;
  'ns1:Name': string;
}

export interface Ns1Taxes {
  'ns1:Tax': Ns1Tax;
}

export interface Ns1Tax {
  'ns1:Amount': string;
  'ns1:CurrencyCode': string;
}

export interface Ns1RoomDescription {
  'ns1:Name': string;
}

export interface FlightItemModel {
  paxJourney: PaxJourney;
  paxSegment: PaxSegment[];
}

export interface TotalOfferPrice {
  HighestOfferPrice: number;
  LowestOfferPrice: number;
  CurCode: string;
}

export interface PassengerModel {
  Pax: Pax[];
}
