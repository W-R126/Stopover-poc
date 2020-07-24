import Utils from './Utils';
import { TripModel, parseTrip } from './Models/TripModel';
import { StopOverModel } from './Models/StopOverModel';
import { PackageTypeModel } from './Models/PackageTypeModel';
import { FareModel, parseFare } from './Models/FlightOfferModel';
import { RoomOfferModel, parseRoomOffer } from './Models/HotelOfferModel';
import { ExperienceDateModel } from './Models/ExperienceDateModel';
import { ExperienceModel, TimeSlotModel } from './Models/ExperienceModel';
import { ExperienceCategoryEnum } from './Enums/ExperienceCategoryEnum';

export default class AppState {
  private static readonly keys = {
    outboundFare: 'Booking.outboundFare',
    tripSearch: 'TripSearch.tripSearch',
    stopOverInfo: 'StopOver.info',
    packageInfo: 'StopOver.packageInfo',
    selectedHotel: 'StopOver.selectedHotel',
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
      (experienceDate) => ({
        date: new Date(experienceDate.date),
        experiences: experienceDate.experiences.map(({
          categories,
          timeSlots,
          opens,
          closes,
          ...rest
        }): ExperienceModel => {
          return {
            categories: categories.map(
              (category) => ExperienceCategoryEnum[category as keyof typeof ExperienceCategoryEnum],
            ),
            timeSlots: timeSlots?.map((ts): TimeSlotModel => ({
              date: new Date(ts.date),
              all: ts.all.map((d) => new Date(d)),
              available: ts.available.map((d) => new Date(d)),
            })),
            opens: new Date(opens),
            closes: new Date(closes),
            ...rest,
          };
        }),
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

  static get hotelRoom(): RoomOfferModel | undefined {
    const hotelRoom = Utils.sessionStore.get<RoomOfferModel>(AppState.keys.selectedHotel);

    return parseRoomOffer(hotelRoom);
  }

  static set hotelRoom(selectedHotel: RoomOfferModel | undefined) {
    Utils.sessionStore.set(AppState.keys.selectedHotel, selectedHotel);
  }

  static get inboundFare(): FareModel | undefined {
    return parseFare(Utils.sessionStore.get(AppState.keys.inboundFare));
  }

  static set inboundFare(offer: FareModel | undefined) {
    Utils.sessionStore.set(AppState.keys.inboundFare, offer);
  }
}
