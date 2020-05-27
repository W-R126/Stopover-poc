import React from 'react';
import Header from './Partial/Header';
import HomeView from './Views/HomeView';
import ContentService from './Services/ContentService';
import AirportService from './Services/AirportService';

export default function App(): JSX.Element {
  const contentService = new ContentService();
  const airportService = new AirportService(contentService);

  return (
    <div id="app">
      <Header />
      <HomeView airportService={airportService} />
    </div>
  );
}
