import BaseService from './BaseService';

import CityNames from './Content/CityNames';
import CountryNames from './Content/CountryNames';
import AirportNames from './Content/AirportNames';

export default class ContentService extends BaseService {
  private readonly activeRequests: { [key: string]: Promise<any> } = {};

  async get(resource: string): Promise<any> {
    // If a resource is already requested, return the initial request.
    if (this.activeRequests[resource] !== undefined) {
      return this.activeRequests[resource];
    }

    const pending = new Promise((resolve) => {
      let data;

      switch (resource) {
        case 'cityNames':
          data = CityNames;
          break;
        case 'countryNames':
          data = CountryNames;
          break;
        case 'airportNames':
          data = AirportNames;
          break;
        default:
          data = undefined;
          break;
      }

      resolve(data);

      delete this.activeRequests[resource];
    });

    this.activeRequests[resource] = pending;

    return pending;
  }
}
