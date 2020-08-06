import React from 'react';
import css from './FlightItem.module.css';

import BgImg from '../../../../Assets/Images/Experimental/Sky-Back.jpg';
import PlanImg from '../../../../Assets/Images/Experimental/Plane.svg';

export default function FlightItem(): JSX.Element {
  return (
    <div className={css.ComponentContainer}>
      <div className={css.Content}>
        <img className={css.Back} src={BgImg} alt="back" />
        <img src={PlanImg} alt="plan" />
        <div className={css.FlightType}>
          Upcoming flight
        </div>
        <div className={css.AirportDiv}>
          <div className={css.Airport}>
            AUH
          </div>
          {'>'}
          <div className={css.Airport}>
            BEY
          </div>
        </div>
        <div className={css.Date}>
          26 May 2020
        </div>
        <div className={css.CheckIn} role="button">
          {'Check in >'}
        </div>
      </div>
    </div>
  );
}
