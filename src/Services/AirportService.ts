import BaseService from './BaseService';
import { AirportModel } from '../Models/AirportModel';
import ContentService from './ContentService';
import Airports from './Content/Airports';

export default class AirportService extends BaseService {
  private readonly activeRequests: { [key: string]: Promise<any> } = {};

  private readonly contentService: ContentService;

  constructor(contentService: ContentService, baseURL?: string) {
    super(baseURL);

    this.contentService = contentService;
  }

  async getOriginAirports(): Promise<AirportModel[]> {
    // If origin airports are already requested, return the initial request.
    if (this.activeRequests.originAirports !== undefined) {
      return this.activeRequests.originAirports;
    }

    const citiesReq = this.contentService.get('cities');
    const countriesReq = this.contentService.get('countries');
    const airportNamesReq = this.contentService.get('airports');

    const cities = await citiesReq;
    const countries = await countriesReq;
    const airportNames = await airportNamesReq;

    const pending = new Promise<AirportModel[]>((resolve) => {
      const result: AirportModel[] = [];

      Airports.forEach((airport) => {
        const name = airportNames.find(
          (airportName: any) => airportName.code === airport.code,
        )?.name;

        const cityName = cities.find((city: any) => city.code === airport.cityCode)?.name;

        const countryName = countries.find(
          (country: any) => country.code === airport.countryCode,
        )?.name;

        result.push({
          code: airport.code,
          name,
          nameLower: name?.toLowerCase(),
          cityCode: airport.cityCode,
          cityName,
          cityNameLower: cityName?.toLowerCase(),
          countryCode: airport.countryCode,
          countryName,
          countryNameLower: countryName.toLowerCase(),
          coordinates: {
            lat: airport.coordinates.lat,
            long: airport.coordinates.long,
          },
        });
      });

      result.sort((a, b) => {
        if (!(a.cityName && b.cityName)) {
          return 0;
        }

        if (a.cityName < b.cityName) {
          return -1;
        }

        if (a.cityName > b.cityName) {
          return 1;
        }

        return 0;
      });

      resolve(result);

      delete this.activeRequests.originAirports;
    });

    this.activeRequests.originAirports = pending;

    return pending;
  }
}
