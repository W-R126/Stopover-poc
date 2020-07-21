import BaseService from './BaseService';

import CityNames from './Content/CityNames';
import CountryNames from './Content/CountryNames';
import AirportNames from './Content/AirportNames';
import FlightModels from './Content/FlightModels';
import TimeZones from './Content/TimeZones';
import MainMenu from './Content/MainMenu';
import Common from './Content/Common';
import Config from '../Config';

export default class ContentService extends BaseService {
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
        case 'mainMenu':
          data = MainMenu;
          break;
        case 'timeZones':
          data = TimeZones;
          break;
        case 'flightModels':
          data = FlightModels;
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
        default:
          data = undefined;
          break;
      }

      return data;
    });
  }
}
