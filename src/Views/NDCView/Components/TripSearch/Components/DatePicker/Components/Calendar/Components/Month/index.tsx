import React from 'react';

import css from './Month.module.css';
import ContentService from '../../../../../../../../../../Services/ContentService';
import DateUtils from '../../../../../../../../../../DateUtils';

interface MonthProps {
  month: Date;
  contentService: ContentService;
  span: boolean;
  selecting: boolean;
  onSelectionStart: (start: Date) => void;
  onSelectionEnd: (end: Date) => void;
  start?: Date;
  end?: Date;
  className?: string;
}

interface MonthState {
  days: (Date | undefined)[];
  hoveredDay?: Date;
}

const hoverListeners: ((hoveredDay?: Date) => void)[] = [];

export default class Month extends React.Component<MonthProps, MonthState> {
  static readonly defaultProps: Pick<MonthProps, 'span'> = {
    span: true,
  };

  private readonly weekdays: string[];

  private readonly today: Date;

  constructor(props: MonthProps) {
    super(props);

    this.weekdays = DateUtils.getWeekdays(props.contentService.locale);
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

    if (prevProps.month.valueOf() !== month.valueOf()) {
      this.setState({ days: this.getDays(month) });
    }
  }

  componentWillUnmount(): void {
    hoverListeners.splice(hoverListeners.indexOf(this.onCalendarDayHover));
  }

  private onCalendarDayHover(hoveredDay?: Date): void {
    this.setState({ hoveredDay });
  }

  private onSelectionStart(newStart: Date): void {
    const start = new Date(newStart);
    start.setHours(0, 0, 0, 0);

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

  private onSelectionEnd(newEnd: Date): void {
    const end = new Date(newEnd);
    end.setHours(0, 0, 0, 0);

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
      contentService,
      start,
      span,
      selecting,
      className,
    } = this.props;

    let { end } = this.props;

    if (!span) {
      end = start;
    }

    const { days, hoveredDay } = this.state;
    const negative = (hoveredDay && start && DateUtils.compareDates(start, hoveredDay) === 1);

    const classList = [css.Month];

    if (className) {
      classList.push(className);
    }

    if (selecting) {
      classList.push(css.Selecting);
    }

    if (negative) {
      classList.push(css.Negative);
    }

    return (
      <div className={classList.join(' ')}>
        <span className={css.Title}>
          {`${month.toLocaleDateString(
            contentService.locale,
            { month: 'long' },
          )} ${month.getFullYear()}`}
        </span>
        <div className={css.Weekdays}>
          {this.weekdays.map((weekday, idx) => (
            <span key={`weekday-${idx}`}>
              {weekday.substr(0, 3)}
            </span>
          ))}
        </div>
        <div className={css.Days} onMouseOut={(): void => this.onMouseOverDay(undefined)}>
          {days.map((day, idx) => {
            const dayClassList: string[] = [];

            if (day === undefined || day < this.today) {
              dayClassList.push(css.Disabled);
            } else if (selecting && day && hoveredDay && start) {
              if (
                (
                  DateUtils.compareDates(hoveredDay, start) === -1
                  && DateUtils.compareDates(hoveredDay, day) === -1
                  && DateUtils.compareDates(day, start) === -1
                )
                || (
                  DateUtils.compareDates(hoveredDay, start) === 1
                  && DateUtils.compareDates(hoveredDay, day) === 1
                  && DateUtils.compareDates(day, start) === 1
                )
              ) {
                dayClassList.push(css.InSpan);
              }
            }

            if (
              day
              && start
              && end
              && DateUtils.compareDates(day, start) === 1
              && DateUtils.compareDates(day, end) === -1
            ) {
              dayClassList.push(css.InSpan);
            }

            if (day && start && DateUtils.compareDates(day, start) === 0) {
              dayClassList.push(css.SelectionStart);
            }

            if (day && end && DateUtils.compareDates(day, end) === 0) {
              dayClassList.push(css.SelectionEnd);
            }

            const selected = (
              day
              && (
                (start && DateUtils.compareDates(day, start) === 0)
                || (end && DateUtils.compareDates(day, end) === 0)
              )
            ) || false;

            return (
              <span
                key={`day-${idx}`}
                className={dayClassList.join(' ')}
                role="option"
                aria-selected={selected}
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
