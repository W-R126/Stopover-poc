export interface AirportModel {
  code: string;
  name?: string;
  nameLower?: string;
  cityCode: string;
  cityName?: string;
  cityNameLower?: string;
  countryCode: string;
  countryName?: string;
  countryNameLower?: string;
  coordinates: {
    lat: number;
    long: number;
  };
}
