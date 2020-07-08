import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './reset.css';
import './common.module.css';
import App from './App';
import Config from './Config';

const config = new Config();

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App config={config} />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
