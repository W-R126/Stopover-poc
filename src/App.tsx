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
import SelectInbound from './Views/SelectInbound';
import ExperienceService from './Services/ExperienceService';
import GoogleMaps from './Components/GoogleMaps';
import NDCView from './Views/NDCView';
import NDCService from './Views/NDCView/Services/NDCService';

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
              <SelectInbound
                stopOverService={stopOverService}
                flightOfferService={flightOfferService}
                contentService={contentService}
              />
            </Route>
          </Switch>
        </Route>
      </Switch>
    </div>
  );
}
