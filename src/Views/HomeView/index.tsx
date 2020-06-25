import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import css from './HomeView.module.css';
import TripSearch from '../../Components/TripSearch';
import AirportService from '../../Services/AirportService';
import { TripSearchData, defaultTripSearchData } from '../../Components/TripSearch/TripSearchData';
import Utils from '../../Utils';

interface HomeViewProps extends RouteComponentProps {
  airportService: AirportService;
  locale: string;
}

interface HomeViewState {
  tripSearchData: TripSearchData;
}

class HomeView extends React.Component<HomeViewProps, HomeViewState> {
  constructor(props: HomeViewProps) {
    super(props);

    this.state = {
      tripSearchData: defaultTripSearchData(),
    };

    this.onTripSearchChange = this.onTripSearchChange.bind(this);
    this.onTripSearch = this.onTripSearch.bind(this);
  }

  private onTripSearchChange(tripSearchData: TripSearchData): void {
    this.setState({ tripSearchData });
  }

  private onTripSearch(data: TripSearchData): void {
    const { history } = this.props;

    history.push(Utils.getBookingUrl(data));
  }

  render(): JSX.Element {
    const { tripSearchData: data } = this.state;
    const { airportService, locale } = this.props;

    return (
      <div className={css.HomeView}>
        <div className={css.TopImage} />
        <div className={`${css.ContentWrapper} content-wrapper`}>
          <TripSearch
            className={css.TripSearch}
            locale={locale}
            data={data}
            onChange={this.onTripSearchChange}
            airportService={airportService}
            onSearch={this.onTripSearch}
          />
        </div>
      </div>
    );
  }
}

export default withRouter(HomeView);
