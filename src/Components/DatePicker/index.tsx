import React from 'react';

import './DatePicker.css';
import Calendar, { CalendarData } from '../Calendar';

interface DatePickerProps {
  data: CalendarData;
  span: boolean;
  locale: string;
  onChange: (data: CalendarData) => void;
}

interface DatePickerState {
  expanded: boolean;
}

export default class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
  static readonly defaultProps: Pick<DatePickerProps, 'span' | 'locale'> = {
    locale: 'en-US',
    span: true,
  };

  private readonly selfRef = React.createRef<HTMLDivElement>();

  private readonly calendarRef = React.createRef<Calendar>();

  constructor(props: DatePickerProps) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onFocusIn = this.onFocusIn.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('mousedown', this.onClickOutside);
    document.addEventListener('focusin', this.onFocusIn);
  }

  componentWillUnmount(): void {
    document.removeEventListener('mousedown', this.onClickOutside);
    document.removeEventListener('focusin', this.onFocusIn);
  }

  private onFocusIn(e: any): void {
    this.onClickOutside(e);
  }

  private onClickOutside(e: any): void {
    if (!this.selfRef.current || this.selfRef.current.contains(e.target)) {
      return;
    }

    this.collapse();
  }

  private getDateString(date?: Date): string {
    if (!date) {
      return '';
    }

    const { locale } = this.props;

    const day = date.getDate();
    const month = date.toLocaleDateString(locale, { month: 'short' });
    const year = date.getFullYear();

    return `${day < 10 ? `0${day}` : day}/${month}/${year}`;
  }

  private expand(): void {
    const { expanded } = this.state;

    if (!expanded) {
      const { data } = this.props;

      if (this.calendarRef.current && data.start) {
        this.calendarRef.current.goToMonth(
          new Date(data.start.getFullYear(), data.start.getMonth(), 1),
        );
      }

      this.setState({ expanded: true });
    }
  }

  private collapse(): void {
    const { expanded } = this.state;

    if (this.calendarRef.current && this.calendarRef.current.state.selecting) {
      this.calendarRef.current.abortSelection();
    }

    if (expanded) {
      this.setState({ expanded: false });
    }
  }

  render(): JSX.Element {
    const {
      span,
      data,
      locale,
      onChange,
    } = this.props;
    const { expanded } = this.state;

    return (
      <div
        ref={this.selfRef}
        className={`date-picker${span ? ' return-trip' : ''}`}
        aria-expanded={expanded}
        role="button"
        onClick={this.expand}
        onFocus={this.expand}
      >
        <div className="outbound">
          <label htmlFor="outbound">Outbound</label>
          <input
            type="text"
            id="outbound"
            placeholder="DD/MMM/YYYY"
            value={this.getDateString(data.start)}
            readOnly
          />
        </div>

        {span && (
          <div className="inbound">
            <label htmlFor="inbound">Inbound</label>
            <input
              type="text"
              id="inbound"
              placeholder="DD/MMM/YYYY"
              value={this.getDateString(data.end)}
              readOnly
            />
          </div>
        )}

        <div
          className="modal-wrapper"
          role="button"
          onClick={this.collapse}
        >
          <div
            className="calendar-wrapper"
            role="button"
            onClick={(e): void => {
              // Don't collapse.
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Calendar
              ref={this.calendarRef}
              locale={locale}
              span={span}
              data={data}
              onChange={onChange}
            />
            <button
              className="btn-primary"
              type="button"
              onClick={this.collapse}
              disabled={!(data.end && data.start)}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }
}
