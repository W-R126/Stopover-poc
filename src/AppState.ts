import Utils from './Utils';
import { TripModel, parseTrip } from './Models/TripModel';
import { StopOverModel } from './Models/StopOverModel';
import { PackageTypeModel } from './Models/PackageTypeModel';
import { FareModel, parseFare } from './Models/FlightOfferModel';
import { RoomOfferModel, parseRoomOffer } from './Models/HotelOfferModel';
import { ExperienceDateModel } from './Models/ExperienceDateModel';
import { ExperienceAvailabilityModel } from './Models/ExperienceModel';

export default class AppState {
  private static readonly keys = {
    outboundFare: 'Booking.outboundFare',
    tripSearch: 'TripSearch.tripSearch',
    stopOverInfo: 'StopOver.info',
    packageInfo: 'StopOver.packageInfo',
    roomOffer: 'StopOver.roomOffer',
    inboundFare: 'Booking.inboundFare',
    onwardFare: 'StopOver.onwardFare',
    stopOverDays: 'StopOver.stopOverDays',
    experienceDates: 'StopOver.experienceDates',
  };

  static get experienceDates(): ExperienceDateModel[] {
    const experienceDates: ExperienceDateModel[] = Utils.sessionStore.get(
      AppState.keys.experienceDates,
    ) ?? [];

    return experienceDates.map(
      (experienceDate): ExperienceDateModel => ({
        date: new Date(experienceDate.date),
        experiences: experienceDate.experiences.map(
          ({ selectedTimeSlot, guests, experience: { availability, ...rest } }) => ({
            selectedTimeSlot: new Date(selectedTimeSlot),
            guests,
            experience: {
              availability: availability.map(
                ({ start, end, ...rest2 }): ExperienceAvailabilityModel => ({
                  start: new Date(start),
                  end: new Date(end),
                  ...rest2,
                }),
              ),
              ...rest,
            },
          }),
        ),
      }),
    );
  }

  static set experienceDates(experienceDates: ExperienceDateModel[]) {
    Utils.sessionStore.set(AppState.keys.experienceDates, experienceDates);
  }

  static get outboundFare(): FareModel | undefined {
    return parseFare(Utils.sessionStore.get(AppState.keys.outboundFare));
  }

  static set outboundFare(offer: FareModel | undefined) {
    Utils.sessionStore.set(AppState.keys.outboundFare, offer);
  }

  static get onwardFare(): FareModel | undefined {
    return parseFare(Utils.sessionStore.get(AppState.keys.onwardFare));
  }

  static set onwardFare(onwardFare: FareModel | undefined) {
    Utils.sessionStore.set(AppState.keys.onwardFare, onwardFare);
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

  static get stopOverDays(): number | undefined {
    return Utils.sessionStore.get(AppState.keys.stopOverDays);
  }

  static set stopOverDays(stopOverDays: number | undefined) {
    Utils.sessionStore.set(AppState.keys.stopOverDays, stopOverDays);
  }

  static get packageInfo(): PackageTypeModel | undefined {
    return Utils.sessionStore.get(AppState.keys.packageInfo);
  }

  static set packageInfo(packageInfo: PackageTypeModel | undefined) {
    Utils.sessionStore.set(AppState.keys.packageInfo, packageInfo);
  }

  static get roomOffer(): RoomOfferModel | undefined {
    const roomOffer = Utils.sessionStore.get<RoomOfferModel>(AppState.keys.roomOffer);

    return parseRoomOffer(roomOffer);
  }

  static set roomOffer(roomOffer: RoomOfferModel | undefined) {
    Utils.sessionStore.set(AppState.keys.roomOffer, roomOffer);
  }

  static get inboundFare(): FareModel | undefined {
    return parseFare(Utils.sessionStore.get(AppState.keys.inboundFare));
  }

  static set inboundFare(offer: FareModel | undefined) {
    Utils.sessionStore.set(AppState.keys.inboundFare, offer);
  }
}
