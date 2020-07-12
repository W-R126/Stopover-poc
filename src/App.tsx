import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Partial/Header';
import HomeView from './Views/HomeView';
import ContentService from './Services/ContentService';
import AirportService from './Services/AirportService';
import BookingView from './Views/BookingView';
import FlightService from './Services/FlightService';
import Config from './Config';
import StopOverService from './Services/StopOverService';
import StopOverView from './Views/StopOverView';
import { StopOverProgressStepEnum } from './Enums/StopOverProgressStepEnum';

export default function App({ config }: { config: Config }): JSX.Element {
  const contentService = new ContentService('en-GB', 'AED', config.apiBaseURL);
  const airportService = new AirportService(contentService, config.apiBaseURL);
  const flightService = new FlightService(airportService, contentService, config.apiBaseURL);
  const stopOverService = new StopOverService(config.apiBaseURL);

  return (
    <div id="app">
      <Header contentService={contentService} />
      <Switch>
        <Route exact path="/">
          <HomeView airportService={airportService} contentService={contentService} />
        </Route>

        <Route path="/booking">
          <BookingView
            stopOverService={stopOverService}
            airportService={airportService}
            flightService={flightService}
            contentService={contentService}
          />
        </Route>

        <Route
          path={`/stopover/:progressStep(${
            Object.keys(StopOverProgressStepEnum).map((step) => step).join('|')
          })`}
        >
          <StopOverView contentService={contentService} />
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
