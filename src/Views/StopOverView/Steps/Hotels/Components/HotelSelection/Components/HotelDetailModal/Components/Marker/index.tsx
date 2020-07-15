import React from 'react';
import css from './Marker.module.css';
import MarkerIcon from '../../../../../../../../../../Assets/Images/room-red-24px.svg';

export default function Marker(props: any): JSX.Element {
  return (
    <div className={css.Marker}>
      <img src={MarkerIcon} alt="Marker" />
    </div>
  );
}
