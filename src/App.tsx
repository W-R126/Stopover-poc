import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Partial/Header';
import Footer from './Partial/Footer';
import HomeView from './Views/HomeView';
import ContentService from './Services/ContentService';

export default function App(): JSX.Element {
  const contentService = new ContentService();

  return (
    <div id="app">
      <Header contentService={contentService} />
      <Switch>
        <Route
          exact
          path="/"
          render={(): JSX.Element => (
            <HomeView contentService={contentService} />
          )}
        />
      </Switch>
      <Footer contentService={contentService} />
      <div className="content-wrapper" style={{ margin: '0 auto', textAlign: 'center' }}>
        <button
          type="button"
          onClick={(): void => {
            const html = document.querySelector('html');

            if (html) {
              html.dir = html.dir === 'rtl' ? '' : 'rtl';
            }
          }}
        >
          Switch Direction
        </button>
      </div>
    </div>
  );
}
