import React from 'react';
import css from './Hotels.module.css';
import Stopover from './Components/HotelViewStopover';

export default function Hotels(): JSX.Element {
  return (
    <div>
      <div className={css.HotelView}>
        <Stopover />
      </div>
    </div>
  );
}
