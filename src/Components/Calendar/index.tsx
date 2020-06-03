import React from 'react';

import Month from './Month';

import './Calendar.css';
import navigationArrow from '../../Assets/Images/navigation-arrow.svg';

export interface CalendarData {
  start?: Date;
  end?: Date;
}

interface CalendarProps {
  data: CalendarData;
  span: boolean;
  maxDate: Date;
  minDate: Date;
  locale: string;
  onChange: (data: CalendarData) => void;
}

interface CalendarState {
  startMonth: Date;
  displayTwoMonths: boolean;
  selecting: boolean;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export default class Calendar extends React.Component<CalendarProps, CalendarState> {
  static readonly defaultProps: Pick<CalendarProps, 'span' | 'maxDate' | 'minDate' | 'locale'> = {
    span: true,
    locale: 'en-US',
    minDate: new Date(today),
    maxDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
  };

  constructor(props: CalendarProps) {
    super(props);

    this.state = {
      startMonth: this.getStartMonth(props.data.start),
      displayTwoMonths: true,
      selecting: false,
    };

    this.onResize = this.onResize.bind(this);
    this.onSelectionStart = this.onSelectionStart.bind(this);
    this.onSelectionEnd = this.onSelectionEnd.bind(this);
    this.navigateBack = this.navigateBack.bind(this);
    this.navigateForward = this.navigateForward.bind(this);
  }

  componentDidMount(): void {
    window.addEventListener('resize', this.onResize);

    this.onResize();
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize(): void {
    const { displayTwoMonths } = this.state;
    const { data } = this.props;

    if (displayTwoMonths && window.innerWidth <= 630) {
      this.setState({ displayTwoMonths: false });
    } else if (!displayTwoMonths && window.innerWidth > 630) {
      this.setState({ displayTwoMonths: true });
    } else {
      return;
    }

    if (data.start) {
      this.goToMonth(data.start);
    }
  }

  private onSelectionStart(start: Date): void {
    const { onChange, data } = this.props;

    Object.assign(data, { end: undefined, start });

    onChange(data);

    this.setState({ selecting: true });
  }

  private onSelectionEnd(end: Date): void {
    const { onChange, data } = this.props;

    Object.assign(data, { end });

    if ((data.start && data.end) && data.end < data.start) {
      // Swap start and end if span is negative.
      Object.assign(data, { start: data.end, end: data.start });
    }

    onChange(data);

    this.setState({ selecting: false });
  }

  private getStartMonth(start?: Date): Date {
    const startMonth = new Date(start ?? today);
    startMonth.setHours(0, 0, 0, 0);
    startMonth.setDate(1);

    return startMonth;
  }

  private navigateBack(): void {
    const { startMonth: stateStartMonth } = this.state;
    const startMonth = new Date(stateStartMonth);

    startMonth.setMonth(startMonth.getMonth() - 1);

    this.goToMonth(startMonth);
  }

  private navigateForward(): void {
    const { startMonth: stateStartMonth } = this.state;
    const startMonth = new Date(stateStartMonth);

    startMonth.setMonth(startMonth.getMonth() + 1);

    this.goToMonth(startMonth);
  }

  abortSelection(): void {
    const { onChange } = this.props;

    this.setState({ selecting: false });

    onChange({ start: undefined, end: undefined });
  }

  goToMonth(startMonth: Date): void {
    const { maxDate } = this.props;

    if (startMonth >= maxDate) {
      this.setState({
        startMonth: new Date(startMonth.getFullYear(), startMonth.getMonth() - 1, 1),
      });
    } else {
      this.setState({ startMonth });
    }
  }

  render(): JSX.Element {
    const {
      data,
      span,
      locale,
      minDate,
      maxDate,
    } = this.props;

    const {
      startMonth: month1,
      displayTwoMonths,
      selecting,
    } = this.state;

    const month2 = new Date(month1);
    month2.setMonth(month2.getMonth() + 1);

    return (
      <div className="calendar">
        <button
          type="button"
          className="navigate-left"
          onClick={this.navigateBack}
          disabled={minDate >= month1}
          tabIndex={-1}
        >
          <img src={navigationArrow} alt="Nagivate left" />
        </button>
        <Month
          selecting={selecting}
          month={month1}
          span={span}
          locale={locale}
          start={data.start}
          end={data.end}
          onSelectionStart={this.onSelectionStart}
          onSelectionEnd={this.onSelectionEnd}
        />
        {displayTwoMonths && (
          <Month
            selecting={selecting}
            month={month2}
            span={span}
            locale={locale}
            start={data.start}
            end={data.end}
            onSelectionStart={this.onSelectionStart}
            onSelectionEnd={this.onSelectionEnd}
          />
        )}
        <button
          type="button"
          className="navigate-right"
          onClick={this.navigateForward}
          disabled={maxDate <= (displayTwoMonths ? month2 : month1)}
          tabIndex={-1}
        >
          <img src={navigationArrow} alt="Nagivate right" />
        </button>
      </div>
    );
  }
}
