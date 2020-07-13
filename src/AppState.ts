import { OfferModel, parseOffer } from './Models/OfferModel';
import Utils from './Utils';
import { TripModel, parseTrip } from './Models/TripModel';
import { StopOverModel } from './Models/StopOverModel';
import { PackageTypeModel } from './Models/PackageTypeModel';
import { HotelModel } from './Models/HotelModel';

export default class AppState {
  private static readonly keys = {
    outboundOffer: 'Booking.outboundOffer',
    tripSearch: 'TripSearch.tripSearch',
    stopOverInfo: 'StopOver.info',
    packageInfo: 'StopOver.packageInfo',
    selectedHotel: 'StopOver.selectedHotel',
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

  static get stopOverInfo(): StopOverModel | undefined {
    return Utils.sessionStore.get(AppState.keys.stopOverInfo);
  }

  static set stopOverInfo(stopOverInfo: StopOverModel | undefined) {
    Utils.sessionStore.set(AppState.keys.stopOverInfo, stopOverInfo);
  }

  static get packageInfo(): PackageTypeModel | undefined {
    return Utils.sessionStore.get(AppState.keys.packageInfo);
  }

  static set packageInfo(packageInfo: PackageTypeModel | undefined) {
    Utils.sessionStore.set(AppState.keys.packageInfo, packageInfo);
  }

  static get selectedHotel(): HotelModel | undefined {
    const selectedHotel = Utils.sessionStore.get<HotelModel>(AppState.keys.selectedHotel);

    if (selectedHotel) {
      selectedHotel.checkIn = new Date(selectedHotel.checkIn);
      selectedHotel.checkOut = new Date(selectedHotel.checkOut);
    }

    return selectedHotel;
  }

  static set selectedHotel(selectedHotel: HotelModel | undefined) {
    Utils.sessionStore.set(AppState.keys.selectedHotel, selectedHotel);
  }
}
