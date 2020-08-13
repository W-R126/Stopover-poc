import React from 'react';

import css from './DestinationAirport.module.css';
import SuitCaseGrey from '../../../../../../../Assets/Images/Experimental/Suitcase-Grey.svg';
import SuiteCaseOrange from '../../../../../../../Assets/Images/Experimental/Suitcase-Orange.svg';
import { AirportModel } from '../../../../../../../Models/AirportModel';
import Input from '../../../../../../../Components/UI/Input';
import RangeSlider from '../../../../../Components/RangeSlider';

interface DestinationAirportProps {
  id?: string;
  className?: string;
  wrapperClassName?: string;
  focusedClassName?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  tabIndex: number;
  value?: AirportModel;
  airports: AirportModel[];
  onChange: (value?: AirportModel) => void;
  price: number;
  onChangePrice: (value: number) => void;
}

interface DestinationAirportState {
  query: string;
  collapsed: boolean;
  focused: boolean;
  hoveredIndex: number;
  showCountFactor: number;
  listType: number;
}

export default class DestinationAirport extends React.Component<
  DestinationAirportProps,
  DestinationAirportState
> {
  static readonly defaultProps: Pick<DestinationAirportProps, 'tabIndex'> = {
    tabIndex: 0,
  };

  private readonly showCount = 50;

  private readonly resultRef = React.createRef<HTMLDivElement>();

  private readonly ALL_LIST = 0;

  private readonly POPULAR_LIST = 1;

  private readonly SURPRISE_LIST = 2;

  constructor(props: DestinationAirportProps) {
    super(props);

    this.state = {
      query: props.value ? this.getAirportQueryName(props.value) : '',
      collapsed: true,
      focused: false,
      hoveredIndex: 0,
      showCountFactor: 1,
      listType: this.ALL_LIST,
    };

    this.onResultScroll = this.onResultScroll.bind(this);
    this.onQueryChange = this.onQueryChange.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.setListType = this.setListType.bind(this);
  }

  componentDidMount(): void {
    if (!this.resultRef.current) {
      return;
    }

    this.resultRef.current.addEventListener('scroll', this.onResultScroll);
  }

  componentDidUpdate(prevProps: DestinationAirportProps): void {
    const { value } = this.props;
    const { focused } = this.state;

    if (prevProps.value !== value) {
      if (value) {
        this.setState({ query: this.getAirportQueryName(value) });
      } else if (!focused) {
        // Only clear query if the field is not focused.
        this.setState({ query: '' });
      }
    }
  }

  componentWillUnmount(): void {
    if (!this.resultRef.current) {
      return;
    }

    this.resultRef.current.removeEventListener('scroll', this.onResultScroll);
  }

  private onResultScroll(): void {
    if (!this.resultRef.current) {
      return;
    }

    const scrollHeight = this.resultRef.current.scrollHeight - this.resultRef.current.clientHeight;

    if (this.resultRef.current.scrollTop > scrollHeight - 800) {
      const { showCountFactor } = this.state;
      this.setState({ showCountFactor: showCountFactor + 1 });
    }
  }

  private onQueryChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { onChange } = this.props;

    onChange(undefined);

    if (this.resultRef.current) {
      this.resultRef.current.scrollTop = 0;
    }

    this.expand();

    this.setState({
      query: e.target.value,
      hoveredIndex: 0,
      showCountFactor: 1,
    });
  }

  private onFocus(): void {
    this.setState({ focused: true });
  }

  private onBlur(): void {
    const { listType } = this.state;
    if (listType === this.ALL_LIST) { this.collapse(); }

    this.setState({ focused: false });
  }

  private onKeyDown(e: React.KeyboardEvent<HTMLInputElement>): void {
    const { collapsed } = this.state;
    let { hoveredIndex } = this.state;
    const { filteredAirports } = this;

    if (e.key === 'Escape') {
      this.collapse();

      return;
    }

    if (!collapsed) {
      if (e.key === 'Enter') {
        this.select(filteredAirports[hoveredIndex]);
        this.setState({ hoveredIndex: 0 });
        this.collapse();

        return;
      }
    }

    this.expand();

    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    // Navigate with keys.
    const { value } = this.props;

    if (value) {
      hoveredIndex = filteredAirports.indexOf(value);
    }

    hoveredIndex += e.key === 'ArrowUp' ? -1 : 1;

    if (hoveredIndex >= 0 && hoveredIndex < filteredAirports.length) {
      if (this.resultRef.current) {
        // Scroll if hovered item moves out of vision.
        const resultRefRect = this.resultRef.current.getBoundingClientRect();
        const elementRect = this.resultRef.current.children[hoveredIndex].getBoundingClientRect();
        const offsetTop = elementRect.top - resultRefRect.top;
        const offsetBottom = offsetTop + elementRect.height;

        if (offsetTop < 0) {
          this.resultRef.current.scrollTop += (offsetTop + 1);

          if (this.resultRef.current.scrollTop === 1) {
            this.resultRef.current.scrollTop = 0;
          }
        } else if (offsetBottom > resultRefRect.height) {
          this.resultRef.current.scrollTop += offsetBottom - resultRefRect.height;
        }
      }

      this.setState({ hoveredIndex });
    }
  }

  private getAirportQueryName(airport: AirportModel): string {
    return `${airport.cityName}, ${airport.code}`;
  }

  private get filteredAirports(): AirportModel[] {
    const { airports } = this.props;
    const { query } = this.state;

    const queryLower = query.toLowerCase();
    const queryParts = queryLower.replace(/,|\./g, '').replace(/\s{2,}/g, ' ').split(' ');

    let filteredAirports = airports;

    queryParts.forEach((queryPart) => {
      filteredAirports = filteredAirports.filter(
        (airport) => airport.searchString.indexOf(queryPart) !== -1,
      );
    });

    // Sort by airport city name starting with query.
    const startsWithMatch: AirportModel[] = [];
    const others: AirportModel[] = [];

    filteredAirports.forEach((airport) => {
      if (airport.cityName?.toLowerCase().startsWith(queryLower)) {
        startsWithMatch.push(airport);
      } else {
        others.push(airport);
      }
    });

    return startsWithMatch.concat(others);
  }

  private setListType(nType: number): void {
    this.setState({
      listType: nType,
    });
  }

  private select(value?: AirportModel): void {
    const { onChange } = this.props;

    onChange(value);
  }

  private expand(): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.toggle();
    }
  }

  private collapse(): void {
    const { collapsed } = this.state;
    const { value } = this.props;

    if (!value) {
      // Empty query if no value is selected.
      this.setState({ query: '' });
    }

    if (!collapsed) {
      this.toggle();
    }
  }

  private toggle(): void {
    const { collapsed } = this.state;

    this.setState({ collapsed: !collapsed });
  }

  render(): JSX.Element {
    const {
      id,
      className,
      style,
      placeholder,
      value,
      price,
      onChangePrice,
      wrapperClassName,
      focusedClassName,
    } = this.props;

    const {
      query,
      collapsed,
      focused,
      hoveredIndex,
      showCountFactor,
      listType,
    } = this.state;

    const { filteredAirports } = this;

    const showCount = showCountFactor * this.showCount;
    const classList = [css.AirportSearch];

    if (className) {
      classList.push(className);
    }

    if (focused) {
      classList.push(css.Focused);

      if (focusedClassName) {
        classList.push(focusedClassName);
      }
    }

    const wrapperClassList = [css.Wrapper];

    if (wrapperClassName) {
      wrapperClassList.push(wrapperClassName);
    }

    const dropdownMenu = [
      this.ALL_LIST,
      this.POPULAR_LIST,
      this.SURPRISE_LIST,
    ];

    return (
      <div
        className={classList.join(' ')}
        style={style}
        aria-expanded={!collapsed}
      >
        <div className={css.ModalWrapper}>
          <div className={wrapperClassList.join(' ')}>
            <Input
              type="text"
              id={id}
              placeholder={placeholder}
              value={query}
              onFocus={this.onFocus}
              onChange={this.onQueryChange}
              onKeyDown={this.onKeyDown}
              onBlur={this.onBlur}
            />
            <div className={css.Result} ref={this.resultRef}>
              <div className={css.ListTypeContainer}>
                <div className={css.ListTypeSelector}>
                  {dropdownMenu.map((item, idx) => (
                    <div
                      key={idx}
                      className={`${css.TypeItem} ${listType === item ? css.Active : ''}`}
                      onMouseDown={(e): void => {
                        e.stopPropagation();
                        e.preventDefault();

                        this.setListType(item);
                      }}
                    >
                      {item === this.ALL_LIST && 'All destinations'}
                      {item === this.POPULAR_LIST && 'Popular destinations'}
                      {item === this.SURPRISE_LIST && 'Surprise me'}
                    </div>
                  ))}
                </div>

                {
                  listType === this.POPULAR_LIST && (
                  <div className={`${css.ListTypeDescription} ${css.PopularListDescription}`}>
                    <img src={SuitCaseGrey} alt="Suitecase grey" />
                    <div className={css.Description}>
                      <strong>Not sure where to go?</strong>
                      <br />
                      Why not visit one of these popular cites.
                    </div>
                  </div>
                  )
                }
                {
                  listType === this.SURPRISE_LIST && (
                    <div className={`${css.ListTypeDescription} ${css.PopularListDescription}`}>
                      <img src={SuiteCaseOrange} alt="Suitecase orange" />
                      <div className={css.Description}>
                        <strong>Feeling adventurous?</strong>
                        <br />
                        Enter your budget below to get some surprising recommendations
                      </div>
                    </div>
                  )
                }
              </div>
              {
                (listType === this.ALL_LIST || listType === this.POPULAR_LIST) && (
                  <>
                    {filteredAirports.length === 0 && (
                      <div className={css.NoResult}>
                        No result
                      </div>
                    )}
                    {filteredAirports
                      .slice(0, showCount)
                      .map((airport, idx) => {
                        if (listType === this.ALL_LIST) {
                          const airportClassList = [css.Airport];

                          if (hoveredIndex === idx) {
                            airportClassList.push(css.Hover);
                          }
                          return (
                            <div
                              className={airportClassList.join(' ')}
                              key={`airport-${airport.code}`}
                              role="option"
                              aria-selected={value?.code === airport.code}
                              onMouseMove={(): void => {
                                if (hoveredIndex !== idx) {
                                  this.setState({ hoveredIndex: idx });
                                }
                              }}
                              onMouseDown={(e): void => {
                                e.stopPropagation();
                                e.preventDefault();

                                this.select(airport);
                                this.collapse();
                              }}
                            >
                              <div>
                                <span className={css.CityName}>
                                  {airport.cityName}
                                </span>
                                <span className={css.AirportCode}>
                                  {airport.code}
                                </span>
                              </div>
                              <div>
                                <span className={css.AirportName}>
                                  {airport.name}
                                </span>
                                <span className={css.CountryName}>
                                  {airport.countryName}
                                </span>
                              </div>
                            </div>
                          );
                        } if (listType === this.POPULAR_LIST) {
                          const airportClassList = [css.AirportCity];

                          if (hoveredIndex === idx) {
                            airportClassList.push(css.Hover);
                          }

                          return (
                            <div
                              className={airportClassList.join(' ')}
                              key={`airport-${airport.code}`}
                              role="option"
                              aria-selected={value?.code === airport.code}
                              onMouseMove={(): void => {
                                if (hoveredIndex !== idx) {
                                  this.setState({ hoveredIndex: idx });
                                }
                              }}
                              onMouseDown={(e): void => {
                                e.stopPropagation();
                                e.preventDefault();

                                this.select(airport);
                                this.collapse();
                              }}
                            >
                              <img className={css.CityImg} src={airport.cityBgImg} alt={airport.code} />
                              <div className={css.Overlay} />
                              <div className={css.CityName}>{airport.cityName}</div>
                              <div className={css.Price}>
                                £
                                {airport.price}
                              </div>
                            </div>

                          );
                        }
                        return null;
                      })}
                  </>
                )
              }
              {listType === this.SURPRISE_LIST && (
              <div className={css.SurpriseDropDown}>
                <div className={css.Budget}>My budget is:</div>
                <div className={css.BudgetValue}>
                  £
                  {price}
                </div>
                <RangeSlider
                  className={css.BudgetSlider}
                  min={0}
                  max={3000}
                  value={price}
                  onChange={(rangeValue: number): void => {
                    onChangePrice(rangeValue);
                  }}
                />
                <div className={css.InspireButton}>
                  Inspire me
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
