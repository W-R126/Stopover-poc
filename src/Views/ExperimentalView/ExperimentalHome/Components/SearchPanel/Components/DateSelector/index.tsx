import React from 'react';

import css from './DateSelector.module.css';

import Calendar from '../../../../../../../Components/TripSearch/Components/DatePicker/Components/Calendar';

import ContentService from '../../../../../../../Services/ContentService';
import DateUtils from '../../../../../../../DateUtils';

import { TripTypeEnum } from '../../../../../../../Enums/TripTypeEnum';

interface DateSelectorProps {
  tripType: TripTypeEnum;
  flightDate: any;
  contentService: ContentService;
  changeDate: (start?: Date, end?: Date) => void;
  changeTrip: (tripType: TripTypeEnum) => void;
}

interface DateSelectorState {
  collapsed: boolean;
  dateInfo: any;
  selectedTab: number; // 0: none, 1: depature 2: return
  selectedView: number;
}

export default class DateSelector extends React.Component<DateSelectorProps, DateSelectorState> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  private readonly calendarRef = React.createRef<Calendar>();

  private readonly VIEW_CALENDAR = 0;

  private readonly VIEW_EVENT = 1;

  constructor(props: DateSelectorProps) {
    super(props);
    const { flightDate } = props;
    this.state = {
      collapsed: true,
      selectedTab: -1,
      selectedView: 0,
      dateInfo: flightDate,
    };

    this.onChange = this.onChange.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onFocusIn = this.onFocusIn.bind(this);
    this.setSelectedTab = this.setSelectedTab.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('mousedown', this.onClickOutside);
    document.addEventListener('focusin', this.onFocusIn);
  }

  componentDidUpdate(prevProps: DateSelectorProps): void {
    const { flightDate } = this.props;
    if (prevProps.flightDate !== flightDate) {
      this.setState({
        dateInfo: flightDate,
      });
    }
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

  private onChange(start: Date | undefined, end: Date | undefined): void {
    this.setState({
      dateInfo: { start, end },
    });
  }

  private setSelectedTab(tab: number): void {
    this.setState({
      selectedTab: tab,
    });
    this.expand();
  }

  private expand(): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.setState({ collapsed: false });
    }
  }

  private collapse(): void {
    const { collapsed } = this.state;
    const { flightDate } = this.props;

    if (!collapsed) {
      this.setState({
        collapsed: true,
        selectedTab: 0,
        dateInfo: { ...flightDate },
      });
    }
  }

  private clickDone(): void {
    const { changeDate } = this.props;
    const { dateInfo } = this.state;
    this.collapse();
    changeDate(dateInfo.start, dateInfo.end);
  }

  private renderSelectDate(date: Date): string {
    if (!date) return '';
    const { contentService } = this.props;
    return date.toLocaleDateString(
      contentService.locale,
      { month: 'short', day: 'numeric', year: 'numeric' },
    );
  }

  private renderFooterDate(): string {
    const { contentService } = this.props;
    const { dateInfo } = this.state;
    if (dateInfo.start && dateInfo.end) {
      const startDateStr = dateInfo.start.toLocaleDateString(
        contentService.locale,
        { month: 'short', day: 'numeric' },
      );
      const startDateArr = startDateStr.split(' ');

      const endDateStr = dateInfo.end.toLocaleDateString(
        contentService.locale,
        { month: 'short', day: 'numeric' },
      );
      const endDateArr = endDateStr.split(' ');

      const startResult = `${startDateArr[1]} ${startDateArr[0]}`;
      const endResult = `${endDateArr[1]} ${endDateArr[0]}`;
      const nightValue = DateUtils.getDaysDelta(dateInfo.end, dateInfo.start);
      const nightResult = `(${nightValue} night${nightValue > 0 ? 's' : ''})`;

      return `${startResult} to ${endResult} ${nightResult}`;
    } return '';
  }

  private renderTripButton(): JSX.Element | null {
    const { tripType, changeTrip } = this.props;
    if (tripType === TripTypeEnum.roundTrip) {
      return (
        <div
          className={css.TripButton}
          role="button"
          onClick={(): void => changeTrip(TripTypeEnum.oneWay)}
        >
          One way only
        </div>
      );
    } if (tripType === TripTypeEnum.oneWay) {
      return (
        <div
          className={css.TripButton}
          role="button"
          onClick={(): void => changeTrip(TripTypeEnum.roundTrip)}
        >
          Return Trip
        </div>
      );
    }

    return null;
  }

  render(): JSX.Element {
    const {
      contentService, tripType, flightDate,
    } = this.props;
    const {
      collapsed, dateInfo, selectedTab, selectedView,
    } = this.state;

    const wrapperClassList = [css.ComponentContainer];
    if (tripType === TripTypeEnum.roundTrip) {
      wrapperClassList.push(css.RounndTripWrapper);
    }

    const titleClassList = [css.DateValue];
    if (collapsed) { titleClassList.push(css.Collapsed); }
    return (
      <div
        className={wrapperClassList.join(' ')}
        ref={this.selfRef}
        onFocus={this.expand}
      >
        <div
          className={titleClassList.join(' ')}
        >
          <div
            className={`${css.DateInput} ${selectedTab === 1 ? css.Selected : ''}`}
            role="button"
            onClick={(): void => {
              this.setSelectedTab(1);
            }}
          >
            Depature date
            <span>{this.renderSelectDate(flightDate.start)}</span>
          </div>
          {tripType === TripTypeEnum.roundTrip && (
          <div
            className={`${css.DateInput} ${selectedTab === 2 ? css.Selected : ''}`}
            onClick={(): void => {
              this.setSelectedTab(2);
            }}
            role="button"
          >
            Return date
            <span>{this.renderSelectDate(flightDate.end)}</span>
          </div>
          )}
        </div>
        {!collapsed
          && (
          <div className={css.DropDownContainer}>
            <div className={css.LeftSection}>
              <div className={css.ViewSelector}>
                <div className={`${css.ViewSelectorItem} ${selectedView === this.VIEW_CALENDAR ? css.Selected : ''}`}>Calendar</div>
                <div className={`${css.ViewSelectorItem} ${selectedView === this.VIEW_EVENT ? css.Selected : ''}`}>Events</div>
              </div>
              <Calendar
                start={dateInfo.start}
                end={dateInfo.end}
                ref={this.calendarRef}
                contentService={contentService}
                span={tripType === TripTypeEnum.roundTrip}
                onChange={(start, end): void => this.onChange(start, end)}
              />
              <div className={css.Footer}>
                <div>
                  {this.renderFooterDate()}
                </div>
                {this.renderTripButton()}
                <div
                  className={css.DoneButton}
                  onClick={(): void => { this.clickDone(); }}
                  role="button"
                >
                  Done
                </div>
              </div>
            </div>
            <div className={css.RightSection}>
              <div className={css.Title}>
                Melborune in May
              </div>
              <div className={css.Description}>
                <strong>Season</strong>
                <br />
                Autumn-Winter
              </div>
              <div className={css.Description}>
                <strong>Avg. Temperature</strong>
                <br />
                16°C
              </div>
              <div className={css.Description}>
                <strong>Weather</strong>
                <br />
                Pleasant with ocational rain
              </div>
            </div>
          </div>
          )}
      </div>
    );
  }
}
