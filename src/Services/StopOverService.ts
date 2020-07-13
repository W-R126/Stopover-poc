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
    outbound: Date,
    inbound?: Date,
  ): Promise<{
    airSearchResults: any;
    hotelAvailabilityInfos: any;
  } | undefined> {
    try {
      let nextInbound;

      const minInbound = new Date(outbound);
      minInbound.setDate(minInbound.getDate() + days + 1);

      if (inbound) {
        nextInbound = inbound;

        if (minInbound > inbound) {
          nextInbound = minInbound;
        }
      }

      const stopover = {
        airportCode,
        days,
      };

      if (nextInbound) {
        Object.assign(stopover, { nextLegDateModifier: nextInbound.toLocaleDateString('sv-SE') });
      }

      const result = await this.http.post(
        '/confirmStopover',
        {
          stopoverItineraryParts: [{
            selectedOriginalOfferRef: hash,
            stopover,
          }],
        },
        { headers: SessionManager.getSessionHeaders() },
      );

      SessionManager.setSessionHeaders(result.headers);

      if (result.status !== 200) {
        return undefined;
      }

      const { airSearchResults, hotelAvailabilityInfos } = result.data;

      return {
        airSearchResults,
        hotelAvailabilityInfos,
      };
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
