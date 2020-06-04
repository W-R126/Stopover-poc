import BaseService from './BaseService';
import { TripSearchData } from '../Components/TripSearch/TripSearchData';
import { FlightModel } from '../Models/FlightModel';

export default class FlightService extends BaseService {
  async getFlights(tripSearchData: TripSearchData): Promise<FlightModel[]> {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (tripSearchData.originDestination.destination?.code === 'BCN') {
      return [];
    }

    return [{}];
  }
}
