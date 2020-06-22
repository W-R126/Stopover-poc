import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Partial/Header';
import HomeView from './Views/HomeView';
import ContentService from './Services/ContentService';
import AirportService from './Services/AirportService';
import BookingView from './Views/BookingView';
import { TripType } from './Enums/TripType';
import { CabinType } from './Enums/CabinType';
import FlightService from './Services/FlightService';

export default function App(): JSX.Element {
  const contentService = new ContentService();
  const airportService = new AirportService(contentService);
  const flightService = new FlightService(airportService, contentService);
  const locale = 'en-US';

  const tripTypes = Object.keys(TripType);
  const cabinTypes = Object.keys(CabinType);
  const dateExpr = '[0-9]{4}-[0-9]{2}-[0-9]{2}';

  return (
    <div id="app">
      <Header contentService={contentService} />
      <Switch>
        <Route exact path="/">
          <HomeView airportService={airportService} locale={locale} />
        </Route>
        <Route
          path={
            `/booking/:originCode([a-z]{3})/:destinationCode([a-z]{3})/:cabinType(${
              cabinTypes.join('|')
            })/:adults([1-9]{1})/:children([0-9]{1})/:infants([0-9]{1})/:tripType(${
              tripTypes.join('|')
            })/:outbound(${dateExpr})?/:inbound(${dateExpr})?`
          }
        >
          <BookingView
            airportService={airportService}
            flightService={flightService}
            locale={locale}
          />
        </Route>
      </Switch>
    </div>
  );
}
