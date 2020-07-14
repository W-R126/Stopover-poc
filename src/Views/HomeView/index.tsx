import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import commonCss from '../../common.module.css';
import css from './HomeView.module.css';
import TripSearch from '../../Components/TripSearch';
import AirportService from '../../Services/AirportService';
import { TripModel, copyTrip, tripToUrl } from '../../Models/TripModel';
import ContentService from '../../Services/ContentService';
import AppState from '../../AppState';

interface HomeViewProps extends RouteComponentProps {
  airportService: AirportService;
  contentService: ContentService;
}

interface HomeViewState {
  trip: TripModel;
}

class HomeView extends React.Component<HomeViewProps, HomeViewState> {
  constructor(props: HomeViewProps) {
    super(props);

    this.state = {
      trip: copyTrip(),
    };

    this.onTripSearchChange = this.onTripSearchChange.bind(this);
    this.onTripSearch = this.onTripSearch.bind(this);
  }

  private onTripSearchChange(trip: TripModel): void {
    this.setState({ trip });
  }

  private onTripSearch(trip: TripModel): void {
    const { history } = this.props;

    AppState.tripSearch = trip;
    AppState.outboundFare = undefined;

    history.push(`/booking?${tripToUrl(trip)}`);
  }

  render(): JSX.Element {
    const { trip: data } = this.state;
    const { airportService, contentService } = this.props;

    return (
      <div className={css.HomeView}>
        <div className={css.TopImage} />
        <div className={`${css.ContentWrapper} ${commonCss.ContentWrapper}`}>
          <TripSearch
            className={css.TripSearch}
            contentService={contentService}
            trip={data}
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
