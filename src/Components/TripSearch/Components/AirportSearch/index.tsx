import React from 'react';

import './AirportSearch.css';
import { AirportModel } from '../../../../Models/AirportModel';

interface AirportSearchProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  tabIndex: number;
  value?: AirportModel;
  airports: AirportModel[];
  exclude: AirportModel[];
  onChange: (value?: AirportModel) => void;
}

interface AirportSearchState {
  query: string;
  expanded: boolean;
  focused: boolean;
  hoveredIndex: number;
  showCountFactor: number;
}

export default class AirportSearch extends React.Component<
  AirportSearchProps,
  AirportSearchState
> {
  static readonly defaultProps: Pick<AirportSearchProps, 'tabIndex' | 'exclude'> = {
    tabIndex: 0,
    exclude: [],
  };

  private readonly resultRef = React.createRef<HTMLDivElement>();

  constructor(props: AirportSearchProps) {
    super(props);

    this.state = {
      query: props.value ? this.getAirportQueryName(props.value) : '',
      expanded: false,
      focused: false,
      hoveredIndex: 0,
      showCountFactor: 1,
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

  componentDidUpdate(prevProps: AirportSearchProps): void {
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
    const { expanded } = this.state;
    let { hoveredIndex } = this.state;
    const { filteredAirports } = this;

    if (e.key === 'Escape') {
      this.collapse();

      return;
    }

    if (expanded) {
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
    const { airports, exclude } = this.props;
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

    return startsWithMatch.concat(others).filter((airport) => exclude.indexOf(airport) === -1);
  }

  private select(value?: AirportModel): void {
    const { onChange } = this.props;

    onChange(value);
  }

  private expand(): void {
    const { expanded } = this.state;

    if (!expanded) {
      this.toggle();
    }
  }

  private collapse(): void {
    const { expanded } = this.state;
    const { value } = this.props;

    if (!value) {
      // Empty query if no value is selected.
      this.setState({ query: '' });
    }

    if (expanded) {
      this.toggle();
    }
  }

  private toggle(): void {
    const { expanded } = this.state;

    this.setState({ expanded: !expanded });
  }

  render(): JSX.Element {
    const {
      id,
      className: propClassName,
      style,
      placeholder,
      value,
    } = this.props;

    const {
      query,
      expanded,
      focused,
      hoveredIndex,
      showCountFactor,
    } = this.state;

    const { filteredAirports } = this;

    const showCount = showCountFactor * 50;
    const className = ['airport-search'];

    if (propClassName) {
      className.push(propClassName);
    }

    if (focused) {
      className.push('focused');
    }

    return (
      <div
        className={className.join(' ')}
        style={style}
        aria-expanded={expanded}
      >
        <div className="modal-wrapper">
          <div className="wrapper">
            <input
              type="text"
              id={id}
              placeholder={placeholder}
              value={query}
              onFocus={this.onFocus}
              onChange={this.onQueryChange}
              onKeyDown={this.onKeyDown}
              onBlur={this.onBlur}
            />
            <div className="result" ref={this.resultRef}>
              {filteredAirports.length === 0 && (
                <div className="no-result">
                  No result
                </div>
              )}
              {filteredAirports
                .slice(0, showCount)
                .map((airport, idx) => (
                  <div
                    className={`airport${hoveredIndex === idx ? ' hovered' : ''}`}
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
                    <div className="row">
                      <span className="city-name">
                        {airport.cityName}
                      </span>
                      <span className="airport-code">
                        {airport.code}
                      </span>
                    </div>
                    <div className="row">
                      <span className="airport-name">
                        {airport.name}
                      </span>
                      <span className="country-name">
                        {airport.countryName}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
