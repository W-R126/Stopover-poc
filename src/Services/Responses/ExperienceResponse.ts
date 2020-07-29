export interface ExperienceResponse {
  experiences: Experience[];
  offeredDiscount: OfferedDiscount;
}

export interface Experience {
  product: Product;
  availabilities: Availabilities;
}

export interface Product {
  productId: string;
  productSupplierId: string;
  productDistributorId: string;
  productDistributorName: string;
  productSourceName: string;
  productDefaultLanguage: string;
  productFromPrice: string;
  productStartDate: string;
  productEndDate: string;
  productBookingStartDate: string;
  productBookingAdvanceTimeMin: number;
  productDuration: number;
  productAvailability: boolean;
  productPastDateBookingAllowed: boolean;
  productCancellationAllowed: boolean;
  productCapacityType: string;
  productAdmissionType: string;
  productPickupPoint: string;
  productContent: ProductContent;
  productRedemptionRules: ProductRedemptionRules;
  productCodeSettings: ProductCodeSettings;
  productPaymentDetail: ProductPaymentDetail;
  productTypeSeasons: ProductTypeSeason[];
  productCancellationPolicies: ProductCancellationPolicy[];
  productNoshowPolicy?: ProductNoshowPolicy;
  productLocations: ProductLocation[];
  productCategories: string[];
  productLanguages: string[];
  productContentLanguages: string[];
  productCreated: string;
  productModified: string;
  productBookingQuantityMin: number;
  productBookingQuantityMax: number;
  productShowCapacityCount: number;
  productDisabled: boolean;
  productThirdParty: boolean;
  productSeasonalPricing: boolean;
  productQuantityPricing: boolean;
  productDynamicPricing: boolean;
  productRelationDetailsVisible: boolean;
  productCluster: boolean;
  productCombi: boolean;
  productAddon: boolean;
  productAvailabilityAssigned: boolean;
  productCapacity: boolean;
  productTraveldateRequired: boolean;
  productOverbookingAllowed: boolean;
  offeredEtihadDiscounts: OfferedEtihadDiscount[];
  productOpeningTimes: ProductOpeningTime[];
}

export interface ProductContent {
  productTitle: string;
  productShortDescription: string;
  productLongDescription: string;
  productAdditionalInformation: string;
  productDurationText: string;
  productSupplierName: string;
  productEntryNotes: string;
  productHighlights: ProductHighlight[];
  productImages: ProductImage[];
  productIncludes: ProductInclude[];
  productExcludes: ProductExclude[];
  productFavorite: boolean;
}

export interface ProductHighlight {
  highlightDescription: string;
}

export interface ProductImage {
  imageType: string;
  imageUrl: string;
}

export interface ProductInclude {
  includeDescription: string;
}

export interface ProductExclude {
  excludeDescription: string;
}

export interface ProductRedemptionRules {
  redemptionCountType: string;
  redemptionCountValue: number;
  redemptionHasDuration: boolean;
}

export interface ProductCodeSettings {
  productCodeFormat: string;
  productCodeSource: string;
  productVoucherSettings: string;
  productGroupCode: boolean;
  productCombiCode: boolean;
}

export interface ProductPaymentDetail {
  productPaymentCurrency: ProductPaymentCurrency;
}

export interface ProductPaymentCurrency {
  currencyCode: string;
}

export interface ProductTypeSeason {
  productTypeSeasonStartDate: string;
  productTypeSeasonEndDate: string;
  productTypeSeasonDetails: ProductTypeSeasonDetail[];
}

export interface ProductTypeSeasonDetail {
  productTypeId: string;
  productType: string;
  productTypeLabel: string;
  productTypeAgeFrom: number;
  productTypeAgeTo: number;
  productTypePax: number;
  productTypeCapacity: number;
  productTypePriceType: string;
  productTypePriceTaxId: string;
  productTypePricing: ProductTypePricing;
}

export interface ProductTypePricing {
  productTypeListPrice: string;
  productTypeDiscount: string;
  productTypeSalesPrice: string;
  productTypeResalePrice: string;
}

export interface ProductCancellationPolicy {
  cancellationDescription: string;
  cancellationType: string;
  cancellationFeeThreshold: number;
}

export interface ProductNoshowPolicy {
  feePercentage: string;
}

export interface ProductLocation {
  locationId: string;
  locationName: string;
  locationDescription: string;
  locationType: string;
  locationAddress: LocationAddress;
  locationPickupPoint: boolean;
}

export interface LocationAddress {
  name: string;
  country: string;
  countryCode: string;
  latitude: string;
  longitude: string;
  notes: string;
  city: string;
}

export interface OfferedEtihadDiscount {
  discountType: string;
  discountAmountOrPct: string;
  description: string;
}

export interface ProductOpeningTime {
  openingTimeValidFrom: string;
  openingTimeDetails: OpeningTimeDetail[];
}

export interface OpeningTimeDetail {
  openingTimeDay: string;
  openingTimeStart: string;
  openingTimeEnd: string;
}

export interface Availabilities {
  items: Item[];
  totalItems: number;
}

export interface Item {
  availabilityId: string;
  availabilityCapacityId: string;
  availabilityActive: boolean;
  availabilityProductId: string;
  availabilityFromDateTime: string;
  availabilityToDateTime: string;
  availabilityDuration: number;
  availabilityCreated: string;
  availabilityModified: string;
  availabilitySpots?: AvailabilitySpots;
}

export interface AvailabilitySpots {
  availabilitySpotsTotal: number;
  availabilitySpotsOpen: number;
  availabilitySpotsReserved: number;
  availabilitySpotsBooked: number;
}

export interface OfferedDiscount {
  discountType: string;
  discountAmountOrPct: string;
  description: string;
}
