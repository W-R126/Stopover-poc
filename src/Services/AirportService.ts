import BaseService from './BaseService';
import { AirportModel } from '../Models/AirportModel';
import ContentService from './ContentService';
import Airports from './Content/Airports';

export default class AirportService extends BaseService {
  private readonly contentService: ContentService;

  constructor(contentService: ContentService, baseURL?: string) {
    super(baseURL);

    this.contentService = contentService;
  }

  async getAirport(code: string): Promise<AirportModel | undefined> {
    const codeUpper = code.toUpperCase();

    return this.createRequest(`getAirports/${codeUpper}`, async () => {
      const airports = await this.getAirports();

      return airports.find((airport) => airport.code === codeUpper);
    });
  }

  async getAirports(): Promise<AirportModel[]> {
    return this.createRequest('getAirports', async () => {
      const cityNamesReq = this.contentService.get('cityNames');
      const countryNamesReq = this.contentService.get('countryNames');
      const airportNamesReq = this.contentService.get('airportNames');
      const timeZonesReq = this.contentService.get('timeZones');

      const cityNames = await cityNamesReq;
      const countryNames = await countryNamesReq;
      const airportNames = await airportNamesReq;
      const timeZones = await timeZonesReq;

      const result: AirportModel[] = [];

      Airports.forEach((airport) => {
        const timeZone = timeZones.find((tz: any) => tz.code === airport.code)?.timeZone;

        const airportName = airportNames.find(
          (name: any) => name.code === airport.code,
        )?.name;

        const cityName = cityNames.find((city: any) => city.code === airport.cityCode)?.name;

        const countryName = countryNames.find(
          (country: any) => country.code === airport.countryCode,
        )?.name;

        const searchStringItems = [airport.code];

        if (airportName) {
          searchStringItems.push(airportName);
        }

        if (cityName) {
          searchStringItems.push(cityName);
        }

        if (countryName) {
          searchStringItems.push(countryName);
        }

        result.push({
          searchString: searchStringItems.join(' ').toLowerCase(),
          code: airport.code,
          timeZone: timeZone,
          name: airportName,
          cityCode: airport.cityCode,
          cityName,
          countryCode: airport.countryCode,
          countryName,
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

      return result;
    });
  }
}
