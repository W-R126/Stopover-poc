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
  cityBgImg?: string;
  price?: number;
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

export function parseAirport(airport?: Partial<AirportModel>): AirportModel | undefined {
  if (!airport) {
    return undefined;
  }

  try {
    const {
      cityCode,
      code,
      countryCode,
      searchString,
    } = airport;
    const coordinates = {
      lat: airport.coordinates?.lat,
      long: airport.coordinates?.long,
    };

    if (
      !(cityCode && code && coordinates.long !== undefined && coordinates.lat !== undefined)
      || !(countryCode && searchString)
    ) {
      return undefined;
    }

    return {
      cityCode,
      code,
      coordinates: coordinates as CoordinateModel,
      countryCode,
      searchString,
      cityName: airport.cityName,
      countryName: airport.countryName,
      name: airport.name,
      timeZone: airport.timeZone,
    };
  } catch (err) {
    return undefined;
  }
}
