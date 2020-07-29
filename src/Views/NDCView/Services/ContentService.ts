import BaseService from '../../../Services/BaseService';

import CityNames from '../../../Services/Content/CityNames';
import CountryNames from '../../../Services/Content/CountryNames';
import AirportNames from '../../../Services/Content/AirportNames';
import FlightModels from '../../../Services/Content/FlightModels';
import TimeZones from '../../../Services/Content/TimeZones';
import Common from './Content/Common';
import Config from '../../../Config';

export default class NDCContentService extends BaseService {
  locale = 'en-GB';

  currency = 'AED';

  constructor(locale = 'en-GB', currency = 'AED', config?: Config) {
    super(config);

    this.locale = locale;
    this.currency = currency;
  }

  async get(resource: string): Promise<any> {
    return this.createRequest(resource, async () => {
      let data;

      switch (resource) {
        case 'common':
          data = Common;
          break;
        case 'timeZones':
          data = TimeZones;
          break;
        case 'cityNames':
          data = CityNames;
          break;
        case 'countryNames':
          data = CountryNames;
          break;
        case 'airportNames':
          data = AirportNames;
          break;
        case 'flightModels':
          data = FlightModels;
          break;
        default:
          data = undefined;
          break;
      }

      return data;
    });
  }
}
