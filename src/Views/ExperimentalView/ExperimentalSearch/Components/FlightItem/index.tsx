import React from 'react';
import css from './FlightItem.module.css';

import PlanImg from '../../../../../Assets/Images/Experimental/Plane.svg';
import ChevRightSvg from '../../../../../Assets/Images/Experimental/ChevRight.svg';

export default function FlightItem(): JSX.Element {
  return (
    <div className={css.ComponentContainer}>
      <div className={css.Content}>
        <img src={PlanImg} alt="plan" />
        <div className={css.FlightType}>
          Upcoming flight
        </div>
        <div className={css.AirportDiv}>
          <div className={css.Airport}>
            LHR
          </div>
          <img src={ChevRightSvg} alt="Chev Right" />
          <div className={css.Airport}>
            PEK
          </div>
        </div>
        <div className={css.Date}>
          26 Nov 2020
        </div>
        <div className={css.CheckIn} role="button">
          Check in
          <img src={ChevRightSvg} alt="checkin chevright" />
        </div>
      </div>
    </div>
  );
}
