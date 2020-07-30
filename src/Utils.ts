import { CabinClassEnum } from './Enums/CabinClassEnum';
import { CoordinateModel } from './Models/CoordinateModel';
import { LegModel } from './Models/FlightOfferModel';

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
  static getLegDurationMinutes(legs: LegModel[]): number {
    let duration = 0;

    legs.forEach((leg, idx) => {
      duration += leg.duration;

      if (idx !== legs.length - 1) {
        duration += (leg.arrival.valueOf() - legs[idx + 1].departure.valueOf()) / 60000;
      }
    });

    return duration;
  }

  static getCabinClasses(cabinClass: CabinClassEnum): CabinClassEnum[] {
    const result: CabinClassEnum[] = [cabinClass];

    switch (cabinClass) {
      case CabinClassEnum.economy:
        result.push(CabinClassEnum.business);
        break;
      case CabinClassEnum.business:
        result.push(CabinClassEnum.first);
        break;
      case CabinClassEnum.first:
        result.push(CabinClassEnum.residence);
        break;
      case CabinClassEnum.residence:
      default:
        break;
    }

    return result;
  }

  static upperCaseFirst(str: string): string {
    const [char, ...rest] = str.split('');

    return [(char ?? '').toUpperCase(), ...rest].join('');
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
    return Math.hypot(a.lat - b.lat, a.long - b.long);
  }

  static formatCurrency(amount: number): string {
    const [a, b] = amount.toString().split('.');
    const original = a.split('');
    const offset = original.length % 3;
    const result: string[] = original.splice(0, offset);

    original.forEach((num, idx) => {
      if (idx % 3 === 0 && result.length > 0) {
        result.push(',');
      }

      result.push(num);
    });

    if (b !== undefined) {
      const fraction = Number.parseInt(b, 10);

      return `${result.join('')}.${fraction < 10
        ? `${fraction}0`
        : fraction.toString().substr(0, 2)
      }`;
    }

    return result.join('');
  }

  static compareCheckIn(a = '00:00:00', b = '00:00:00'): number {
    const aSplit = a.split(':');
    const bSplit = b.split(':');

    const aSeconds = (+aSplit[0]) * 60 * 60 + (+aSplit[1]) * 60 + (+aSplit[2]);
    const bSeconds = (+bSplit[0]) * 60 * 60 + (+bSplit[1]) * 60 + (+bSplit[2]);

    if (aSeconds < bSeconds) return -1;
    if (aSeconds > bSeconds) return 1;
    return 0;
  }

  static getMinMax(num: number, min: number, max: number): number {
    return Math.max(Math.min(num, max), min);
  }

  static getQueryParams(
    paramsDef: {
      [key: string]: {
        formatter?: (value: string) => any;
        default?: any;
      };
    },
    searchString: string,
  ): { [key: string]: any } {
    const params: { [key: string]: string } = {};

    searchString.substr(1).split('&').forEach((kvp) => {
      const [key, ...value] = kvp.split('=');

      params[key] = value.join('=');
    });

    const result: { [key: string]: any } = {};

    Object.keys(paramsDef).forEach((key) => {
      if (Object.keys(params).indexOf(key) === -1) {
        result[key] = paramsDef[key].default;
      } else {
        const { formatter } = paramsDef[key];

        result[key] = formatter ? formatter(params[key]) : params[key];
      }
    });

    return result;
  }

  static stringToNumber(value: string, def = 0): number {
    const result = Number.parseInt(value, 10);

    return Number.isNaN(result) ? def : result;
  }
}
