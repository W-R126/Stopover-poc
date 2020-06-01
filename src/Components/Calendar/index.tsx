import React from 'react';

import Month from './Month';

import './Calendar.css';

export interface CalendarData {
  start?: Date;
  end?: Date;
}

interface CalendarProps {
  data: CalendarData;
  span: boolean;
  maxDate: Date;
  locale: string;
  onChange: (data: CalendarData) => void;
}

interface CalendarState {
  startMonth: Date;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export default class Calendar extends React.Component<CalendarProps, CalendarState> {
  static readonly defaultProps: Pick<CalendarProps, 'span' | 'maxDate' | 'locale'> = {
    span: true,
    locale: 'en-US',
    maxDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
  };

  constructor(props: CalendarProps) {
    super(props);

    this.state = {
      startMonth: this.getStartMonth(props.data.start),
    };

    this.onSelectionStart = this.onSelectionStart.bind(this);
    this.onSelectionEnd = this.onSelectionEnd.bind(this);
  }

  private onSelectionStart(start: Date): void {
    const { onChange, data } = this.props;

    Object.assign(data, { end: undefined, start });

    onChange(data);
  }

  private onSelectionEnd(end: Date): void {
    const { onChange, data } = this.props;

    Object.assign(data, { end });

    if ((data.start && data.end) && data.end < data.start) {
      // Swap start and end if span is negative.
      Object.assign(data, { start: data.end, end: data.start });
    }

    onChange(data);
  }

  private getStartMonth(start?: Date): Date {
    const startMonth = new Date(start ?? today);
    startMonth.setHours(0, 0, 0, 0);
    startMonth.setDate(1);

    return startMonth;
  }

  render(): JSX.Element {
    const {
      data,
      span,
      locale,
      // maxDate, TODO.
    } = this.props;

    const { startMonth: month1 } = this.state;
    const month2 = new Date(month1);
    month2.setMonth(month2.getMonth() + 1);

    return (
      <div className="calendar">
        <Month
          month={month1}
          span={span}
          locale={locale}
          start={data.start}
          end={data.end}
          onSelectionStart={this.onSelectionStart}
          onSelectionEnd={this.onSelectionEnd}
        />
        <Month
          month={month2}
          span={span}
          locale={locale}
          start={data.start}
          end={data.end}
          onSelectionStart={this.onSelectionStart}
          onSelectionEnd={this.onSelectionEnd}
        />
      </div>
    );
  }
}
