import React from 'react';

import Month from './Components/Month';

import css from './Calendar.module.css';
import navigationArrow from '../../../../../../Assets/Images/navigation-arrow.svg';
import { CalendarData } from './CalendarData';

interface CalendarProps {
  data: CalendarData;
  span: boolean;
  maxDate: Date;
  minDate: Date;
  locale: string;
  onChange: (data: CalendarData) => void;
  className?: string;
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

    data.end = undefined;
    data.start = start;

    onChange(data);
    this.setState({ selecting: true });
  }

  private onSelectionEnd(end: Date): void {
    const { onChange } = this.props;
    let { data } = this.props;

    data.end = end;

    if ((data.start && data.end) && data.end < data.start) {
      // Swap start and end if span is negative.
      data = { start: data.end, end: data.start };
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

  goToMonth(newStartMonth: Date): void {
    const startMonth = new Date(newStartMonth);

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
      className,
    } = this.props;

    const {
      startMonth: month1,
      displayTwoMonths,
      selecting,
    } = this.state;

    const month2 = new Date(month1);
    month2.setMonth(month2.getMonth() + 1);

    const classList = [css.Calendar];

    if (className) {
      classList.push(className);
    }

    return (
      <div className={classList.join(' ')}>
        <button
          type="button"
          className={css.NavigateBack}
          onClick={this.navigateBack}
          disabled={minDate >= month1}
          tabIndex={-1}
        >
          <img src={navigationArrow} alt="Nagivate left" />
        </button>
        <Month
          className={css.Month}
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
            className={css.Month}
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
          className={css.NavigateForward}
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
