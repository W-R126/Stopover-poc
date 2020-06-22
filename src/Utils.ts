import { TripSearchData } from './Components/TripSearch/TripSearchData';
import { TripType } from './Enums/TripType';
import { CabinType } from './Enums/CabinType';
import { CoordinateModel } from './Models/CoordinateModel';

function createStore(store: Storage): {
  get: <T>(key: string, def?: T) => T | undefined;
  set: <T>(key: string, data?: T) => void;
  remove: (key: string) => void;
} {
  return {
    get: <T>(key: string, def?: T): T | undefined => {
      let data = null;

      if (store) {
        data = store.getItem(key);
      }

      if (data === null) {
        return def;
      }

      return JSON.parse(data);
    },
    set: <T>(key: string, data?: T): void => {
      if (store) {
        store.setItem(key, JSON.stringify(data));
      }
    },
    remove: (key: string): void => {
      if (store) {
        store.removeItem(key);
      }
    },
  };
}

export default class Utils {
  static localStore = createStore(localStorage);

  static sessionStore = createStore(sessionStorage);

  static async sleep(timeMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeMs));
  }

  static getDistance(a: CoordinateModel, b: CoordinateModel): number {
    return Math.sqrt((a.lat - b.lat) ** 2 + (a.long - b.long) ** 2);
  }

  static formatCurrency(amount: number): string {
    const original = amount.toString().split('');
    const offset = original.length % 3;
    const result: string[] = original.splice(0, offset);

    if (original.length === 0) {
      return result.join('');
    }

    original.forEach((num, idx) => {
      if (idx % 3 === 0 && result.length > 0) {
        result.push(',');
      }

      result.push(num);
    });

    return result.join('');
  }

  static getWeekdays(locale: string): string[] {
    const date = new Date(2020, 4, 24);

    const result: string[] = [];

    for (let i = 0; i < 7; i += 1) {
      result.push(date.toLocaleDateString(locale, { weekday: 'long' }));
      date.setDate(date.getDate() + 1);
    }

    return result;
  }

  static getTimeDelta(a: Date, b: Date): string {
    const delta = Math.abs(a.valueOf() - b.valueOf());

    const days = Math.floor(delta / 86400000);
    const hours = Math.floor((delta - days * 86400000) / 3600000);
    const minutes = Math.floor((delta - (days * 86400000 + hours * 3600000)) / 60000);

    let result = `${minutes}m`;

    if (hours > 0) {
      result = `${hours}h ${result}`;
    }

    if (days > 0) {
      result = `${days}d ${result}`;
    }

    return result;
  }

  static getHourMinuteString(date: Date): string {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${hour < 10 ? `0${hour}` : hour}:${minute < 10 ? `0${minute}` : minute}`;
  }

  static getDateString(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
  }

  static compareDatesSimple(a: Date, b: Date): boolean {
    return Utils.compareDates(a, b) === 0;
  }

  static compareDatesExact(a: Date, b: Date): number {
    const aVal = a.valueOf();
    const bVal = b.valueOf();

    if (aVal < bVal) {
      return -1;
    }

    if (aVal > bVal) {
      return 1;
    }

    return 0;
  }

  static compareDates(a: Date, b: Date): number {
    const d1 = new Date(a);
    const d2 = new Date(b);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);

    if (d1.valueOf() < d2.valueOf()) {
      return -1;
    }

    if (d1.valueOf() > d2.valueOf()) {
      return 1;
    }

    return 0;
  }

  static getBookingUrl(data: TripSearchData): string {
    let result = '/booking';

    result += `/${data.originDestination.origin?.code ?? ''}`;
    result += `/${data.originDestination.destination?.code ?? ''}`;
    result += `/${CabinType[data.cabinType]}`;
    result += `/${data.passengers.adults}`;
    result += `/${data.passengers.children}`;
    result += `/${data.passengers.infants}`;
    result += `/${TripType[data.tripType]}`;

    if (data.dates.start) {
      result += `/${Utils.getDateString(data.dates.start)}`;
    } else {
      result += '/';
    }

    if (data.tripType === TripType.return) {
      if (data.dates.end) {
        result += `/${Utils.getDateString(data.dates.end)}`;
      } else if (data.dates.start) {
        result += `/${Utils.getDateString(data.dates.start)}`;
      }
    }

    return result;
  }

  static validateTripSearchData(tripSearchData: TripSearchData): boolean {
    const { originDestination, dates, passengers } = tripSearchData;

    if (!(originDestination.destination && originDestination.origin)) {
      return false;
    }

    if (tripSearchData.tripType === TripType.return && !dates.end) {
      return false;
    }

    if (passengers.adults + passengers.children > 9) {
      return false;
    }

    if (passengers.infants > passengers.adults) {
      return false;
    }

    return true;
  }
}
