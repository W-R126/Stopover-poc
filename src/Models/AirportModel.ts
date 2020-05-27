import { CoordinateModel } from './CoordinateModel';

export interface AirportModel {
  code: string;
  cityCode: string;
  countryCode: string;
  name?: string;
  cityName?: string;
  countryName?: string;
  coordinates: CoordinateModel;
  searchString: string;
}
