export default class DateUtils {
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

  static getDaysDelta(date1: Date, date2: Date): number {
    return Math.floor(Math.abs(date1.valueOf() - date2.valueOf()) / (1000 * 60 * 60 * 24));
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

    return DateUtils.getTimeDeltaFromMs(delta);
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
      return `-${DateUtils.getTimeDeltaFromMs(Math.abs(timeDeltaMs))}`;
    }

    return `+${DateUtils.getTimeDeltaFromMs(Math.abs(timeDeltaMs))}`;
  }

  static getHourMinuteString(date: Date): string {
    const [hour, minute] = date.toLocaleTimeString('sv-SE').split(':');

    return `${hour}:${minute}`;
  }

  static getDateString(date: Date): string {
    return date.toLocaleDateString('sv-SE');
  }

  static getFullDateString(date: Date): string {
    const strDate = date.toLocaleDateString('sv-SE');
    const strHours = this.getHourMinuteString(date);

    return `${strDate} ${strHours}`;
  }

  static compareDatesSimple(a: Date, b: Date): boolean {
    return DateUtils.compareDates(a, b) === 0;
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
}
