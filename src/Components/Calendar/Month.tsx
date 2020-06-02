import React from 'react';
import Utils from '../../Utils';

import './Month.css';

interface MonthProps {
  month: Date;
  locale: string;
  span: boolean;
  selecting: boolean;
  onSelectionStart: (start: Date) => void;
  onSelectionEnd: (end: Date) => void;
  start?: Date;
  end?: Date;
}

interface MonthState {
  days: (Date | undefined)[];
  hoveredDay?: Date;
}

const hoverListeners: ((hoveredDay?: Date) => void)[] = [];

export default class Month extends React.Component<MonthProps, MonthState> {
  static readonly defaultProps: Pick<MonthProps, 'locale' | 'span'> = {
    locale: 'en-US',
    span: true,
  };

  private readonly weekdays: string[];

  private readonly today: Date;

  constructor(props: MonthProps) {
    super(props);

    this.weekdays = Utils.getWeekdays(props.locale);
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);

    this.state = {
      days: this.getDays(props.month),
      hoveredDay: undefined,
    };

    this.onCalendarDayHover = this.onCalendarDayHover.bind(this);
  }

  componentDidMount(): void {
    hoverListeners.push(this.onCalendarDayHover);
  }

  componentDidUpdate(prevProps: MonthProps): void {
    const { month } = this.props;

    if (prevProps.month !== month) {
      this.setState({ days: this.getDays(month) });
    }
  }

  componentWillUnmount(): void {
    hoverListeners.splice(hoverListeners.indexOf(this.onCalendarDayHover));
  }

  private onCalendarDayHover(hoveredDay?: Date): void {
    this.setState({ hoveredDay });
  }

  private onSelectionStart(start: Date): void {
    const {
      onSelectionStart,
      onSelectionEnd,
      span,
    } = this.props;

    onSelectionStart(start);
    this.setState({ hoveredDay: undefined });

    if (!span) {
      onSelectionEnd(start);
    }
  }

  private onSelectionEnd(end: Date): void {
    const { onSelectionEnd } = this.props;

    onSelectionEnd(end);
    this.setState({ hoveredDay: undefined });
  }

  private onMouseOverDay(hoveredDay?: Date): void {
    const { selecting } = this.props;

    if (!selecting) {
      return;
    }

    hoverListeners.forEach((listener) => listener(hoveredDay));
  }

  private getDays(month: Date): (Date | undefined)[] {
    month.setDate(1);

    const year = month.getFullYear();
    const monthNumber = month.getMonth();
    const startDay = month.getDay();
    const days: (Date | undefined)[] = [];

    // Add padding at beginning of month.
    for (let i = 0; i < startDay; i += 1) {
      days.push(undefined);
    }

    // Add the days.
    const monthCopy = new Date(month);
    monthCopy.setMonth(monthCopy.getMonth() + 1);
    monthCopy.setDate(0);

    const dayLimit = monthCopy.getDate();

    for (let i = 1; i <= dayLimit; i += 1) {
      days.push(new Date(year, monthNumber, i));
    }

    return days;
  }

  render(): JSX.Element {
    const {
      month,
      locale,
      start,
      span,
      selecting,
    } = this.props;

    let { end } = this.props;

    if (!span) {
      end = start;
    }

    const { days, hoveredDay } = this.state;
    const negative = (hoveredDay && start && hoveredDay < start);

    return (
      <div className={`month${selecting ? ' selecting' : ''}${negative ? ' negative' : ''}`}>
        <span className="title">
          {`${month.toLocaleDateString(locale, { month: 'long' })} ${month.getFullYear()}`}
        </span>
        <div className="weekdays">
          {this.weekdays.map((weekday, idx) => (
            <span key={`weekday-${idx}`}>
              {weekday.substr(0, 3)}
            </span>
          ))}
        </div>
        <div className="days" onMouseOut={(): void => this.onMouseOverDay(undefined)}>
          {days.map((day, idx) => {
            const className: string[] = [];

            if (day === undefined || day < this.today) {
              className.push('disabled');
            } else if (selecting && day && hoveredDay && start) {
              if (
                (hoveredDay < start && day > hoveredDay && day < start)
                || (hoveredDay > start && day < hoveredDay && day > start)
              ) {
                className.push('in-span');
              }
            }

            if (day && start && end && day > start && day < end) {
              className.push('in-span');
            }

            if (day && start && day.valueOf() === start.valueOf()) {
              className.push('selection-start');
            }

            if (day && end && day.valueOf() === end.valueOf()) {
              className.push('selection-end');
            }

            return (
              <span
                key={`day-${idx}`}
                className={className.join(' ')}
                role="option"
                aria-selected={
                  day && (day.valueOf() === start?.valueOf() || day.valueOf() === end?.valueOf())
                }
                onMouseOver={(): void => this.onMouseOverDay(day)}
                onClick={(): void => {
                  if (day === undefined || day < this.today) {
                    return;
                  }

                  if (selecting) {
                    this.onSelectionEnd(day);
                  } else {
                    this.onSelectionStart(day);
                  }
                }}
              >
                {day?.getDate()}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}
