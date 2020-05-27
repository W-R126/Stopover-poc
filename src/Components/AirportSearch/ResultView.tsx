import React from 'react';
import { AirportModel } from '../../Models/AirportModel';

import './ResultView.css';

interface ResultViewProps {
  airports: AirportModel[];
  value?: AirportModel;
  onSelect: (value: AirportModel) => void;
}

export default function ResultView(props: ResultViewProps): JSX.Element {
  const { airports, value, onSelect } = props;

  return (
    <div className="result-view">
      {airports.map((airport) => (
        <div
          key={`airport-${airport.code}`}
          className={`airport${airport === value ? ' selected' : ''}`}
          role="button"
          onClick={(): void => onSelect(airport)}
        >
          <div className="row-1">
            <span className="city-name">{airport.cityName}</span>
            <span className="airport-code">{airport.code}</span>
          </div>
          <div className="row-2">
            <span className="airport-name">{airport.name}</span>
            <span className="country-name">{airport.countryName}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
