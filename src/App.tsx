import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Partial/Header';
import HomeView from './Views/HomeView';
import ContentService from './Services/ContentService';
import NDCContentService from './Views/NDCView/Services/ContentService';
import AirportService from './Services/AirportService';
import BookingView from './Views/BookingView';
import Config from './Config';
import StopOverService from './Services/StopOverService';
import StopOverView from './Views/StopOverView';
import { StopOverProgressStepEnum } from './Enums/StopOverProgressStepEnum';
import FlightOfferService from './Services/FlightOfferService';
import ExperienceService from './Services/ExperienceService';
import GoogleMaps from './Components/GoogleMaps';
import NDCView from './Views/NDCView';
import NDCService from './Views/NDCView/Services/NDCService';
import DoneView from './Views/DoneView';
import SelectInboundView from './Views/SelectInboundView';
import ExperimentalHome from './Views/ExperimentalView/ExperimentalHome';
import ExperimentalSearch from './Views/ExperimentalView/ExperimentalSearch';

export default function App({ config }: { config: Config }): JSX.Element {
  const contentService = new ContentService('en-GB', 'EUR', config);
  const airportService = new AirportService(contentService, config);
  const ndcContentService = new NDCContentService('en-GB', 'EUR', config);
  const ndcService = new NDCService(ndcContentService, airportService, config);
  const flightOfferService = new FlightOfferService(
    contentService,
    airportService,
    config,
  );
  const stopOverService = new StopOverService(
    contentService,
    airportService,
    config,
  );
  const experienceService = new ExperienceService(config);

  GoogleMaps.apiKey = config.googleMapsApiKey;

  return (
    <div id="app">
      <Switch>
        <Route path="/ndc">
          <NDCView
            ndcService={ndcService}
            airportService={airportService}
            contentService={ndcContentService}
          />
        </Route>

        <Route path="/experimental/home">
          <ExperimentalHome
            contentService={contentService}
            airportService={airportService}
          />
        </Route>
        <Route path="/experimental/search">
          <ExperimentalSearch
            contentService={contentService}
          />
        </Route>

        <Route path="/">
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
                experienceService={experienceService}
                flightOfferService={flightOfferService}
              />
            </Route>

            <Route path="/select-inbound">
              <SelectInboundView
                flightOfferService={flightOfferService}
                contentService={contentService}
              />
            </Route>

            <Route path="/done">
              <DoneView
                flightOfferService={flightOfferService}
                stopOverService={stopOverService}
              />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </div>
  );
}
