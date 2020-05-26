import React from 'react';
import { AirportModel } from '../../Models/AirportModel';
import Input from '../UI/Input';

import './AirportSearch.css';
import ContentService from '../../Services/ContentService';

interface AirportSearchProps {
  contentService: ContentService;
  airports: AirportModel[];
  id?: string;
  tabIndex: number;
  maxHeight: number;
  label?: string;
  value?: AirportModel;
  onChange?: (value?: AirportModel) => void;
}

interface AirportSearchState {
  content: {
    noResult?: string;
  };
  query: string;
  expanded: boolean;
  filteredAirports: AirportModel[];
}

export default class AirportSearch extends React.Component<
  AirportSearchProps,
  AirportSearchState
> {
  static defaultProps: Pick<AirportSearchProps, 'tabIndex' | 'maxHeight'> = {
    tabIndex: 0,
    maxHeight: 400,
  };

  private readonly resultRef = React.createRef<HTMLDivElement>();

  private readonly selfRef = React.createRef<HTMLDivElement>();

  private readonly inputRef = React.createRef<Input>();

  private readonly wrapperRef = React.createRef<HTMLDivElement>();

  constructor(props: AirportSearchProps) {
    super(props);

    const { airports } = props;

    this.state = {
      content: {},
      query: '',
      expanded: false,
      filteredAirports: airports,
    };

    this.onFocus = this.onFocus.bind(this);
    this.onQueryChange = this.onQueryChange.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onTabOutside = this.onTabOutside.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { contentService } = this.props;

    this.setState({ content: await contentService.get('common') });

    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('keyup', this.onTabOutside);
  }

  componentDidUpdate(prevProps: AirportSearchProps): void {
    const { airports: prevAirports } = prevProps;
    const { airports } = this.props;

    if (airports !== prevAirports) {
      this.setState({ filteredAirports: airports });
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
    document.removeEventListener('keyup', this.onTabOutside);
  }

  private onTabOutside(e: any): void {
    if (!this.selfRef.current || this.selfRef.current.contains(document.activeElement)) {
      return;
    }

    if (e.key === 'Tab') {
      const { expanded } = this.state;

      if (expanded) {
        this.setState({ expanded: false });
      }
    }
  }

  private onClickOutside(e: any): void {
    const { expanded } = this.state;

    if (!this.selfRef.current || this.selfRef.current.contains(e.target) || !expanded) {
      return;
    }

    this.setState({ expanded: false });
  }

  private onFocus(): void {
    this.setState({ expanded: true });
  }

  private async onQueryChange(query: string): Promise<void> {
    this.setState({ query }, this.execQuery);
  }

  private get maxHeight(): number {
    const { maxHeight: propMaxHeight } = this.props;
    const { expanded } = this.state;

    if (!this.resultRef.current || !expanded) {
      return 60;
    }

    let maxHeight = this.resultRef.current.getBoundingClientRect().height;

    if (maxHeight > propMaxHeight) {
      maxHeight = propMaxHeight;
    }

    return maxHeight + 61;
  }

  private async execQuery(): Promise<void> {
    const { airports } = this.props;
    const { query } = this.state;

    const strippedQuery = query.replace(/,|\./g, '').replace(/\s{2,}/g, ' ').toLowerCase();

    const queryParts = strippedQuery.split(' ');

    let filteredAirports = airports;

    if (strippedQuery.length >= 3) {
      queryParts.forEach((queryPart) => {
        filteredAirports = filteredAirports.filter(
          (airport) => (
            airport.nameLower?.indexOf(queryPart) !== -1
            || airport.code.indexOf(queryPart.toUpperCase()) !== -1
            || airport.cityNameLower?.indexOf(queryPart) !== -1
            || airport.countryNameLower?.indexOf(queryPart) !== -1
          ),
        );
      });
    }

    await new Promise((resolve) => this.setState({ filteredAirports }, resolve));

    if (this.wrapperRef.current) {
      this.wrapperRef.current.style.maxHeight = `${this.maxHeight}px`;
    }
  }

  private async select(airport: AirportModel): Promise<void> {
    const { onChange } = this.props;

    const query = `${airport?.cityName}, ${airport?.code}` ?? '';

    this.onQueryChange(query);

    setTimeout(() => {
      if (this.inputRef.current) {
        setTimeout(this.inputRef.current.focus, 10);
      }
    }, 10);

    if (onChange) {
      onChange(airport);
    }
  }

  render(): JSX.Element {
    const {
      label,
      value,
      id,
      tabIndex,
      maxHeight: propMaxHeight,
    } = this.props;

    const {
      query,
      expanded,
      filteredAirports,
      content,
    } = this.state;

    const { maxHeight } = this;

    return (
      <div
        ref={this.selfRef}
        className="airport-search-component"
        role="button"
        aria-expanded={expanded}
      >
        <div
          className="wrapper"
          style={{ maxHeight }}
          ref={this.wrapperRef}
        >
          <Input
            ref={this.inputRef}
            label={label}
            type="text"
            id={id}
            value={query}
            tabIndex={tabIndex}
            onChange={this.onQueryChange}
            onFocus={this.onFocus}
          />
          <div className="result" ref={this.resultRef} style={{ maxHeight: propMaxHeight }}>
            {filteredAirports.length === 0 && (
              <div className="no-result">
                {content.noResult}
              </div>
            )}
            {filteredAirports.map((airport, idx) => (
              <div
                className={`airport${airport === value ? ' selected' : ''}`}
                key={`airport-${idx}`}
                role="button"
                onMouseDown={async (): Promise<void> => this.select(airport)}
              >
                <div className="city-iata">
                  <span className="city-name">{airport.cityName}</span>
                  <span className="airport-code">{airport.code}</span>
                </div>
                <div className="airport-country">
                  <span className="airport-name">{airport.name}</span>
                  <span className="country-name">{airport.countryName}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
