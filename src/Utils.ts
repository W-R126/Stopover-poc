export default class Utils {
  static getWeekdays(locale: string): string[] {
    const date = new Date(2020, 4, 24);

    const result: string[] = [];

    for (let i = 0; i < 7; i += 1) {
      result.push(date.toLocaleDateString(locale, { weekday: 'long' }));
      date.setDate(date.getDate() + 1);
    }

    return result;
  }
}
