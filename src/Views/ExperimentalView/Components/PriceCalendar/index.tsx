import React from 'react';

import Month from './Components/Month';

import css from './PriceCalendar.module.css';
import navigationArrow from '../../../../Assets/Images/navigation-arrow.svg';
import ContentService from '../../../../Services/ContentService';
import { DatePriceModel } from '../../MockData';

interface PriceCalendarProps {
  start?: Date;
  end?: Date;
  span: boolean;
  maxDate: Date;
  minDate: Date;
  contentService: ContentService;
  onChange: (start?: Date, end?: Date) => void;
  className?: string;
  datePrice?: DatePriceModel[];
}

interface PriceCalendarState {
  startMonth: Date;
  selecting: boolean;
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export default class PriceCalendar extends React.Component<PriceCalendarProps, PriceCalendarState> {
  static readonly defaultProps: Pick<PriceCalendarProps, 'span' | 'maxDate' | 'minDate'> = {
    span: true,
    minDate: new Date(today),
    maxDate: new Date(today.getFullYear() + 1, today.getMonth(), today.getDate()),
  };

  constructor(props: PriceCalendarProps) {
    super(props);

    this.state = {
      startMonth: this.getStartMonth(props.start),
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

  componentDidUpdate(prevProps: PriceCalendarProps): void {
    const { span, onChange, start } = this.props;

    if (span !== prevProps.span && !span) {
      onChange(start, undefined);
    }
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize(): void {
    const { start } = this.props;

    if (start) {
      this.goToMonth(start);
    }
  }

  private onSelectionStart(nextStart: Date): void {
    const { onChange } = this.props;

    this.setState({ selecting: true });

    onChange(nextStart, undefined);
  }

  private onSelectionEnd(nextEnd: Date): void {
    const { onChange, start, span } = this.props;

    this.setState({ selecting: false });

    if (!span) {
      onChange(nextEnd, undefined);
    } else if (start && nextEnd < start) {
      // Swap start and end if span is negative.
      onChange(nextEnd, start);
    } else {
      onChange(start, nextEnd);
    }
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

    onChange(undefined, undefined);
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
      start,
      end,
      span,
      contentService,
      minDate,
      maxDate,
      className,
      datePrice,
    } = this.props;

    const {
      startMonth: month1,
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
          contentService={contentService}
          start={start}
          end={end}
          onSelectionStart={this.onSelectionStart}
          onSelectionEnd={this.onSelectionEnd}
          datePrice={datePrice}
        />
        <button
          type="button"
          className={css.NavigateForward}
          onClick={this.navigateForward}
          disabled={maxDate <= month1}
          tabIndex={-1}
        >
          <img src={navigationArrow} alt="Nagivate right" />
        </button>
      </div>
    );
  }
}
