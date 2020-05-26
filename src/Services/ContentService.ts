import BaseService from './BaseService';

import Logo from './Content/Logo';
import MainMenu from './Content/MainMenu';
import Common from './Content/Common';
import Footer from './Content/Footer';
import Cities from './Content/Cities';
import Countries from './Content/Countries';
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
        case 'footer':
          data = Footer;
          break;
        case 'mainMenu':
          data = MainMenu;
          break;
        case 'logo':
          data = Logo;
          break;
        case 'common':
          data = Common;
          break;
        case 'cities':
          data = Cities;
          break;
        case 'countries':
          data = Countries;
          break;
        case 'airports':
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
