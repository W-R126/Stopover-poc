import React from 'react';
import css from './DateSelector.module.css';

import EventItemBg1 from '../../../../../../../../../../../Assets/Images/Experimental/EventItem1-Bg.jpg';

import Calendar from '../../../../../../../../../../../Components/TripSearch/Components/DatePicker/Components/Calendar';
import ContentService from '../../../../../../../../../../../Services/ContentService';

interface DateSelectorProps {
  dateInfo: any;
  contentService: ContentService;
  changeDate: Function;
  setShowDropDown: Function;
}

interface DateSelectorState {
  collapsed: boolean;
  dateInfo: any;
}

export default class DateSelector extends React.Component<DateSelectorProps, DateSelectorState> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  private readonly calendarRef = React.createRef<Calendar>();

  constructor(props: DateSelectorProps) {
    super(props);
    const { dateInfo } = props;
    this.state = {
      collapsed: true,
      dateInfo,
    };
    this.onChange = this.onChange.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onFocusIn = this.onFocusIn.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('mousedown', this.onClickOutside);
    document.addEventListener('focusin', this.onFocusIn);
  }

  componentDidUpdate(prevProps: DateSelectorProps): void {
    const { dateInfo } = this.props;
    if (prevProps.dateInfo !== dateInfo) {
      this.setState({
        dateInfo,
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

  private expand(): void {
    const { collapsed } = this.state;
    const { setShowDropDown } = this.props;

    if (collapsed) {
      this.setState({ collapsed: false });
      setShowDropDown(true);
    }
  }

  private collapse(): void {
    const { collapsed } = this.state;
    const { setShowDropDown, dateInfo } = this.props;

    if (!collapsed) {
      this.setState({
        collapsed: true,
        dateInfo,
      });
      setShowDropDown(false);
    }
  }

  private clickDone(): void {
    const { changeDate } = this.props;
    const { dateInfo } = this.state;
    this.collapse();
    changeDate(dateInfo);
  }

  private renderTitleDate(): string {
    const { contentService, dateInfo } = this.props;
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

    return `${startDateArr[1]} ${startDateArr[0]} - ${endDateArr[1]} ${endDateArr[0]}`;
  }

  render(): JSX.Element {
    const { contentService } = this.props;
    const { collapsed, dateInfo } = this.state;

    const titleClassList = [css.DateValue];
    if (collapsed) { titleClassList.push(css.Collapsed); }
    return (
      <div
        className={css.ComponentContainer}
        ref={this.selfRef}
        onFocus={this.expand}
      >
        <div
          className={titleClassList.join(' ')}
          onClick={(): void => {
            this.expand();
          }}
          role="button"
        >
          {this.renderTitleDate()}
          <span className={css.ChevArrow} />
        </div>
        {!collapsed
          && (
          <div className={css.DropDownContainer}>
            <div className={css.CalendarContainer}>
              <Calendar
                start={dateInfo.start}
                end={dateInfo.end}
                ref={this.calendarRef}
                contentService={contentService}
                span
                onChange={(start, end): void => this.onChange(start, end)}
              />
              <div className={css.Footer}>
                <div>May 07 to May 14(7 nights)</div>
                <div className={css.ReturnTrip}>
                  Round trip from AED 675
                </div>
                <div
                  className={css.DoneButton}
                  onClick={() => { this.clickDone(); }}
                  role="button"
                >
                  Done
                </div>
              </div>
            </div>
            <div className={css.RightSection}>
              <div className={css.Title}>Riyadh in May</div>
              <div className={css.Description}>
                <div><strong><i>Season</i></strong></div>
                <div>Spring-Summer</div>
              </div>
              <div className={css.Description}>
                <div><strong><i>Avg. Temperature</i></strong></div>
                <div>39°C</div>
              </div>
              <div className={css.Description}>
                <div><strong><i>Weather</i></strong></div>
                <div>Hot and humid</div>
              </div>
              <div className={css.Events}>
                <div className={css.Title}><strong><i>Events</i></strong></div>
                <div className={css.EventSlider}>
                  <div className={css.EventItem}>
                    <img src={EventItemBg1} alt="Event Item" />
                    <div className={css.EventContnet}>
                      <div className={css.EventTitle}>
                        Global Town Festival 3
                        <br />
                        May 24 - 30
                      </div>
                      <div className={css.LearnMore} role="button">Learn more</div>
                    </div>
                  </div>
                  <div className={css.EventItem}>
                    <img src={EventItemBg1} alt="Event Item" />
                    <div className={css.EventContnet}>
                      <div className={css.EventTitle}>
                        Global Town Festival 3
                        <br />
                        May 24 - 30
                      </div>
                      <div className={css.LearnMore} role="button">Learn more</div>
                    </div>
                  </div>
                  <div className={css.EventItem}>
                    <img src={EventItemBg1} alt="Event Item" />
                    <div className={css.EventContnet}>
                      <div className={css.EventTitle}>
                        Global Town Festival 3
                        <br />
                        May 24 - 30
                      </div>
                      <div className={css.LearnMore} role="button">Learn more</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}
      </div>
    );
  }
}
