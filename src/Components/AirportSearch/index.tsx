import React from 'react';

import './AirportSearch.css';
import closeBtn from '../../Assets/Images/close-btn.svg';
import { AirportModel } from '../../Models/AirportModel';
import ResultView from './ResultView';

interface AirportSearchProps {
  label: string;
  placeholder?: string;
  value?: AirportModel;
  airports?: AirportModel[];
  disabled?: boolean;
  onChange: (value?: AirportModel) => void;
}

interface AirportSearchState {
  query: string;
  expanded: boolean;
  filteredAirports: AirportModel[];
}

export default class AirportSearch extends React.Component<
  AirportSearchProps,
  AirportSearchState
> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: AirportSearchProps) {
    super(props);

    this.state = {
      query: '',
      expanded: false,
      filteredAirports: props.airports || [],
    };

    this.onQueryChange = this.onQueryChange.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onTabOutside = this.onTabOutside.bind(this);
    this.select = this.select.bind(this);
    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('keyup', this.onTabOutside);
  }

  componentDidUpdate(prevProps: AirportSearchProps, prevState: AirportSearchState): void {
    const { airports, value } = this.props;
    const { query } = this.state;

    const newState = {};

    if (query !== prevState.query) {
      this.filterAirports(query);
    }

    if (prevProps.airports !== airports) {
      Object.assign(newState, { filteredAirports: airports || [] });
    }

    if (prevProps.value !== value) {
      Object.assign(
        newState,
        { query: value === undefined ? '' : `${value.cityName}, ${value.code}` },
      );
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
    document.removeEventListener('keyup', this.onTabOutside);
  }

  private onClickOutside(e: any): void {
    const { expanded } = this.state;

    if (!expanded || !this.selfRef.current || this.selfRef.current.contains(e.target)) {
      return;
    }

    if (expanded) {
      this.collapse();
    }
  }

  private onTabOutside(e: any): void {
    const { expanded } = this.state;

    if (!expanded
      || e.key !== 'Tab'
      || !this.selfRef.current
      || this.selfRef.current.contains(e.target)
    ) {
      return;
    }

    this.collapse();
  }

  private onQueryChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const query = e.target.value;

    if (query === '') {
      const { onChange } = this.props;

      onChange(undefined);
    }

    this.filterAirports(query);
  }

  private filterAirports(query: string): void {
    const strippedQuery = query.replace(/,|\./g, '').replace(/\s{2,}/g, ' ').toLowerCase();

    let { airports: filteredAirports = [] } = this.props;

    strippedQuery.split(' ').forEach((queryPart) => {
      filteredAirports = filteredAirports.filter(
        (airport) => airport.searchString.indexOf(queryPart) !== -1,
      );
    });

    this.setState({
      query,
      filteredAirports,
    });
  }

  private select(airport: AirportModel): void {
    const { onChange } = this.props;

    this.collapse();

    onChange(airport);
  }

  private expand(): void {
    this.setState({ expanded: true });
  }

  private collapse(e?: any): void {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const { value } = this.props;
    const newState = { expanded: false };

    if (value) {
      Object.assign(newState, { query: `${value.cityName}, ${value.code}` });
    }

    this.setState(newState);
  }

  render(): JSX.Element {
    const {
      label,
      placeholder,
      disabled,
      value,
    } = this.props;
    const { query, expanded, filteredAirports } = this.state;

    return (
      <div
        ref={this.selfRef}
        className="airport-search"
        aria-expanded={expanded}
      >
        <div className="wrapper">
          <div
            className="search"
            role="button"
            onClick={disabled ? undefined : this.expand}
          >
            <span
              className="close-btn"
              role="button"
              onClick={this.collapse}
            >
              <img src={closeBtn} alt="Close" />
            </span>
            <label className="input-label">
              {label}
            </label>
            <input
              value={query}
              onChange={this.onQueryChange}
              placeholder={placeholder}
              onFocus={this.expand}
              disabled={disabled}
            />
          </div>
          <ResultView
            airports={filteredAirports}
            onSelect={this.select}
            value={value}
          />
        </div>
      </div>
    );
  }
}
