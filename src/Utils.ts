import { TripSearchData } from './Components/TripSearch/TripSearchData';
import { TripTypeEnum } from './Enums/TripTypeEnum';
import { CabinClassEnum } from './Enums/CabinClassEnum';
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
        if (data === undefined) {
          store.removeItem(key);
        } else {
          store.setItem(key, JSON.stringify(data));
        }
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
  static getCabinClasses(cabinClass: CabinClassEnum): string[] {
    let result: string[] = [];

    switch (cabinClass) {
      case CabinClassEnum.economy:
        result = ['Economy', 'Business'];
        break;
      case CabinClassEnum.business:
        result = ['Business', 'First'];
        break;
      case CabinClassEnum.first:
        result = ['First', 'Residence'];
        break;
      case CabinClassEnum.residence:
        result = ['Residence'];
        break;
      default:
        break;
    }

    return result;
  }

  static deepCopy(obj: any): any {
    if (obj instanceof Array) {
      const result: any[] = [];

      obj.forEach((item) => result.push(Utils.deepCopy(item)));

      return result;
    }

    if (obj instanceof Date) {
      return new Date(obj);
    }

    if (obj instanceof Object) {
      const result: { [key: string]: any } = {};

      Object.keys(obj).forEach((key) => {
        result[key] = Utils.deepCopy(obj[key]);
      });

      return result;
    }

    return obj;
  }

  static localStore = createStore(localStorage);

  static sessionStore = createStore(sessionStorage);

  static async sleep(timeMs: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, timeMs));
  }

  static getDistance(a: CoordinateModel, b: CoordinateModel): number {
    return Math.sqrt((a.lat - b.lat) ** 2 + (a.long - b.long) ** 2);
  }

  static formatCurrency(amount: number): string {
    const [a, b] = amount.toString().split('.');
    const original = a.toString().split('');
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

    if (b !== undefined) {
      const fraction = Number.parseInt(b, 10);
      return `${result.join('')}.${fraction < 10 ? `${fraction}0` : fraction}`;
    }

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

  static getTimeDeltaFromMs(timeMs: number): string {
    const days = Math.floor(timeMs / 86400000);
    const hours = Math.floor((timeMs - days * 86400000) / 3600000);
    const minutes = Math.floor((timeMs - (days * 86400000 + hours * 3600000)) / 60000);

    let result = '';

    if (minutes > 0) {
      result = `${minutes}m`;
    }

    if (hours > 0) {
      result = `${hours}h ${result}`;
    }

    if (days > 0) {
      result = `${days}d ${result}`;
    }

    return result;
  }

  static getTimeDelta(a: Date, b: Date): string {
    const delta = Math.abs(a.valueOf() - b.valueOf());

    return Utils.getTimeDeltaFromMs(delta);
  }

  static getTimeZoneDelta(tz1?: string, tz2?: string): string | undefined {
    if (!(tz1 && tz2)) {
      return undefined;
    }

    const date = new Date();
    const date1 = new Date(date.toLocaleString('sv-SE', { timeZone: tz1 }));
    const date2 = new Date(date.toLocaleString('sv-SE', { timeZone: tz2 }));

    const timeDeltaMs = date2.valueOf() - date1.valueOf();

    if (timeDeltaMs < 0) {
      return `-${Utils.getTimeDeltaFromMs(Math.abs(timeDeltaMs))}`;
    }

    return `+${Utils.getTimeDeltaFromMs(Math.abs(timeDeltaMs))}`;
  }

  static getHourMinuteString(date: Date, timeZone?: string): string {
    let [hour, minute] = date.toLocaleTimeString('sv-SE').split(':');

    if (timeZone) {
      [hour, minute] = date.toLocaleTimeString('sv-SE', { timeZone }).split(':');
    }

    return `${hour}:${minute}`;
  }

  static getDateString(date: Date): string {
    return date.toLocaleDateString('sv-SE');
  }

  static getFullDateString(date: Date): string {
    return `${this.getDateString(date)} ${this.getHourMinuteString(date)}`;
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

    result += `/${data.origin?.code ?? ''}`;
    result += `/${data.destination?.code ?? ''}`;
    result += `/${CabinClassEnum[data.cabinClass]}`;
    result += `/${data.passengers.adults}`;
    result += `/${data.passengers.children}`;
    result += `/${data.passengers.infants}`;
    result += `/${TripTypeEnum[data.tripType]}`;

    if (data.outbound) {
      result += `/${Utils.getDateString(data.outbound)}`;
    } else {
      result += '/';
    }

    if (data.tripType === TripTypeEnum.return) {
      if (data.inbound) {
        result += `/${Utils.getDateString(data.inbound)}`;
      } else if (data.outbound) {
        // Inbound is missing, set it to outbound.
        result += `/${Utils.getDateString(data.outbound)}`;
      }
    }

    return result;
  }
}
