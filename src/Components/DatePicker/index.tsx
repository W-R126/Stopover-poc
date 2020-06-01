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

  constructor(props: DatePickerProps) {
    super(props);

    this.state = {
      expanded: false,
    };

    this.expand = this.expand.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('mousedown', this.onClickOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener('mousedown', this.onClickOutside);
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
      this.setState({ expanded: true });
    }
  }

  private collapse(): void {
    const { expanded } = this.state;

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

        <div className="calendar-wrapper">
          <Calendar locale={locale} span={span} data={data} onChange={onChange} />
        </div>
      </div>
    );
  }
}
