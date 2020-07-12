import { OfferModel, parseOffer } from './Models/OfferModel';
import Utils from './Utils';
import { TripModel, parseTrip } from './Models/TripModel';

export default class AppState {
  private static readonly keys = {
    outboundOffer: 'Booking.outboundOffer',
    tripSearch: 'TripSearch.tripSearch',
  };

  static get outboundOffer(): OfferModel | undefined {
    return parseOffer(Utils.sessionStore.get(AppState.keys.outboundOffer));
  }

  static set outboundOffer(offer: OfferModel | undefined) {
    Utils.sessionStore.set(AppState.keys.outboundOffer, offer);
  }

  static get tripSearch(): TripModel | undefined {
    return parseTrip(Utils.sessionStore.get(AppState.keys.tripSearch));
  }

  static set tripSearch(trip: TripModel | undefined) {
    Utils.sessionStore.set(AppState.keys.tripSearch, trip);
  }
}
