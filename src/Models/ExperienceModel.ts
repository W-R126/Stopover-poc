import { PriceModel } from './FlightOfferModel';
import { CoordinateModel } from './CoordinateModel';

export interface ExperienceModel {
  availability: ExperienceAvailabilityModel[];
  title: string;
  supplier: string;
  id: string;
  description: {
    long: string;
    short: string;
  };
  included: string[];
  categories: number[];
  pricing: ExperiencePricingModel[];
  startingFromPrice: PriceModel;
  duration: number;
  info: {
    additional: string;
    note: string;
    highlights: string[];
  };
  image: {
    url?: string;
    thumbURL?: string;
  };
  locations: ExperienceLocationModel[];
}

export interface ExperienceAvailabilityModel {
  start: Date;
  end: Date;
  duration: number;
}

export interface ExperiencePricingModel {
  type: string;
  ageFrom: number;
  ageTo: number;
  id: string;
  label: string;
  price: PriceModel;
}

export interface ExperienceLocationModel {
  name: string;
  city: string;
  type: string;
  description: string;
  country: string;
  coordinates: CoordinateModel;
}
