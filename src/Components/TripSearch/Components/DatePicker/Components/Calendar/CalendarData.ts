export interface CalendarData {
  start?: Date;
  end?: Date;
}

export function copyCalendarData(data?: CalendarData): CalendarData {
  if (!data) {
    return {
      start: undefined,
      end: undefined,
    };
  }

  return {
    start: data.start ? new Date(data.start) : undefined,
    end: data.end ? new Date(data.end) : undefined,
  };
}

export function compareCalendarData(a?: CalendarData, b?: CalendarData): boolean {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  return (
    a.start?.valueOf() === b.start?.valueOf()
    && a.end?.valueOf() === b.end?.valueOf()
  );
}
