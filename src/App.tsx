import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Partial/Header';
import HomeView from './Views/HomeView';
import ContentService from './Services/ContentService';
import AirportService from './Services/AirportService';
import BookingView from './Views/BookingView';
import { TripTypeEnum } from './Enums/TripTypeEnum';
import { CabinClassEnum } from './Enums/CabinClassEnum';
import FlightService from './Services/FlightService';
import Config from './Config';
import StopOverService from './Services/StopOverService';
import StopOverView from './Views/StopOverView';

export default function App({ config }: { config: Config }): JSX.Element {
  const contentService = new ContentService();
  const airportService = new AirportService(contentService);
  const flightService = new FlightService(airportService, contentService, config.apiBaseURL);
  const stopOverService = new StopOverService(config.apiBaseURL);
  const locale = 'en-US';

  const tripTypes = Object.keys(TripTypeEnum);
  const cabinClasses = Object.keys(CabinClassEnum);
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
            `/booking/:originCode([a-z]{3})/:destinationCode([a-z]{3})/:cabinClass(${
              cabinClasses.join('|')
            })/:adults([1-9]{1})/:children([0-9]{1})/:infants([0-9]{1})/:tripType(${
              tripTypes.join('|')
            })/:outbound(${dateExpr})?/:inbound(${dateExpr})?`
          }
        >
          <BookingView
            stopOverService={stopOverService}
            airportService={airportService}
            flightService={flightService}
            locale={locale}
          />
        </Route>

        <Route path="/stopover/:progressStep(hotels|experiences|inbound)">
          <StopOverView />
        </Route>

        <Route path="/select-inbound">
          <strong>Select inbound flight.</strong>
        </Route>

        <Route path="/stopover-accepted">
          <strong>Stopover was accepted.</strong>
        </Route>

      </Switch>
    </div>
  );
}
