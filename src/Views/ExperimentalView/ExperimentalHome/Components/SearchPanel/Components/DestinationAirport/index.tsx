import React from 'react';

import css from './DestinationAirport.module.css';
import { AirportModel } from '../../../../../../../Models/AirportModel';
import Input from '../../../../../../../Components/UI/Input';

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

  private readonly SUPRISE_LIST = 2;

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

  private onBlur(): void{
    this.collapse();

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
              <div className={css.ListTypeSelector}>
                <div className={`${css.TypeItem} ${listType === this.ALL_LIST ? css.Active : ''}`}>
                  All destinations
                </div>
                <div className={`${css.TypeItem} ${listType === this.POPULAR_LIST ? css.Active : ''}`}>
                  Popular destinations
                </div>
                <div className={`${css.TypeItem} ${listType === this.SUPRISE_LIST ? css.Active : ''}`}>
                  Suprise me
                </div>
              </div>
              {filteredAirports.length === 0 && (
                <div className={css.NoResult}>
                  No result
                </div>
              )}
              {filteredAirports
                .slice(0, showCount)
                .map((airport, idx) => {
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
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
