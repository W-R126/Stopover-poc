import BaseService from './BaseService';
import SessionManager from '../SessionManager';
import { StopOverResponse } from './Responses/StopOverResponse';
import { StopOverModel } from '../Models/StopOverModel';

export default class StopOverService extends BaseService {
  async getStopOver(hash: number): Promise<StopOverModel | undefined> {
    try {
      const result = await this.http.post<StopOverResponse>(
        '/stopoverEligibility',
        { shoppingBasketHashCode: hash },
        { headers: SessionManager.getSessionHeaders() },
      );

      SessionManager.setSessionHeaders(result.headers);

      if (result.status === 200) {
        return {
          airportCode: result.data.airportCode,
          days: result.data.stopoverDays,
          customerSegment: result.data.customerSegment,
        };
      }
    } catch (err) {
      //
    }

    return undefined;
  }

  async acceptStopOver(
    hash: number,
    airportCode: string,
    days: number,
  ): Promise<any> {
    try {
      const result = await this.http.post(
        '/confirmStopover',
        {
          stopoverItineraryParts: [{
            selectedOriginalOfferRef: hash,
            stopover: {
              airportCode,
              days,
            },
          }],
        },
        { headers: SessionManager.getSessionHeaders() },
      );

      SessionManager.setSessionHeaders(result.headers);
    } catch (err) {
      //
    }

    return undefined;
  }

  async rejectStopOver(airportCode: string): Promise<undefined> {
    try {
      const result = await this.http.post(
        '/rejectStopover',
        {
          stopover: { airportCode },
        },
        { headers: SessionManager.getSessionHeaders() },
      );

      SessionManager.setSessionHeaders(result.headers);
    } catch (err) {
      //
    }

    return undefined;
  }
}
