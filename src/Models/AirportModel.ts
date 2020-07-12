import { CoordinateModel, copyCoordinates } from './CoordinateModel';

export interface AirportModel {
  code: string;
  cityCode: string;
  countryCode: string;
  timeZone?: string;
  name?: string;
  cityName?: string;
  countryName?: string;
  coordinates: CoordinateModel;
  searchString: string;
}

export function copyAirport(airport: AirportModel): AirportModel {
  return {
    code: airport.code,
    cityCode: airport.cityCode,
    countryCode: airport.countryCode,
    timeZone: airport.timeZone,
    name: airport.name,
    cityName: airport.cityName,
    countryName: airport.countryName,
    coordinates: copyCoordinates(airport.coordinates),
    searchString: airport.searchString,
  };
}

export function isEqualAirports(airport1?: AirportModel, airport2?: AirportModel): boolean {
  return airport1?.code === airport2?.code;
}

export function parseAirport(airport?: { [key: string]: any }): AirportModel | undefined {
  if (!airport) {
    return undefined;
  }

  try {
    return {
      cityCode: airport.cityCode,
      code: airport.code,
      coordinates: {
        lat: airport.coordinates.lat,
        long: airport.coordinates.long,
      },
      countryCode: airport.countryCode,
      searchString: airport.searchString,
      cityName: airport.cityName,
      countryName: airport.countryName,
      name: airport.name,
      timeZone: airport.timeZone,
    };
  } catch (err) {
    return undefined;
  }
}
