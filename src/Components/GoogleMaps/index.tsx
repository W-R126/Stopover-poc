import React from 'react';
import { CoordinateModel } from '../../Models/CoordinateModel';

interface GoogleMapsProps {
  coordinates: CoordinateModel;
}

export default class GoogleMaps extends React.Component<GoogleMapsProps> {
  private static apiKeyInternal = '';

  static set apiKey(apiKey: string) {
    this.apiKeyInternal = apiKey;
  }

  render(): JSX.Element {
    const { coordinates: { lat, long } } = this.props;

    return (
      <iframe
        title="Google Maps"
        frameBorder="0"
        style={{ border: 0, width: '100%', height: '100%' }}
        src={`https://www.google.com/maps/embed/v1/place?key=${GoogleMaps.apiKeyInternal}&q=${
          `${lat},${long}`
        }`}
      />
    );
  }
}
