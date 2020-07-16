import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Partial/Header';
import HomeView from './Views/HomeView';
import ContentService from './Services/ContentService';
import AirportService from './Services/AirportService';
import BookingView from './Views/BookingView';
import Config from './Config';
import StopOverService from './Services/StopOverService';
import StopOverView from './Views/StopOverView';
import { StopOverProgressStepEnum } from './Enums/StopOverProgressStepEnum';
import FlightOfferService from './Services/FlightOfferService';
import SelectInbound from './Views/SelectInbound';

export default function App({ config }: { config: Config }): JSX.Element {
  const contentService = new ContentService('en-GB', 'EUR', config.apiBaseURL);
  const airportService = new AirportService(contentService, config.apiBaseURL);
  const flightOfferService = new FlightOfferService(
    contentService,
    airportService,
    config.apiBaseURL,
  );
  const stopOverService = new StopOverService(
    contentService,
    flightOfferService,
    airportService,
    config.apiBaseURL,
  );

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
            flightOfferService={flightOfferService}
            contentService={contentService}
          />
        </Route>

        <Route
          path={`/stopover/:progressStep(${
            Object.keys(StopOverProgressStepEnum).map((step) => step).join('|')
          })`}
        >
          <StopOverView
            contentService={contentService}
            stopOverService={stopOverService}
            flightOfferService={flightOfferService}
          />
        </Route>

        <Route path="/select-inbound">
          <SelectInbound
            stopOverService={stopOverService}
            flightOfferService={flightOfferService}
            contentService={contentService}
          />
        </Route>

        <Route path="/stopover-accepted">
          <strong>Stopover was accepted.</strong>
        </Route>

      </Switch>
    </div>
  );
}
