import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Partial/Header';
import HomeView from './Views/HomeView';
import ContentService from './Services/ContentService';
import AirportService from './Services/AirportService';
import BookingView from './Views/BookingView';
import { TripType } from './Enums/TripType';
import { CabinType } from './Enums/CabinType';

export default function App(): JSX.Element {
  const contentService = new ContentService();
  const airportService = new AirportService(contentService);
  const locale = 'en-US';

  const tripTypes = Object.keys(TripType);
  const cabinTypes = Object.keys(CabinType);

  return (
    <div id="app">
      <Header />
      <Switch>
        <Route exact path="/">
          <HomeView airportService={airportService} locale={locale} />
        </Route>
        <Route
          path={
            `/booking/:originCode([a-z]{3})/:destinationCode([a-z]{3})/:cabinType(${
              cabinTypes.join('|')
            })/:adults([1-9])/:children([0-9])/:infants([0-9])/:tripType(${
              tripTypes.join('|')
            })/:outbound?/:inbound?`
          }
        >
          <BookingView airportService={airportService} locale={locale} />
        </Route>
      </Switch>
    </div>
  );
}
