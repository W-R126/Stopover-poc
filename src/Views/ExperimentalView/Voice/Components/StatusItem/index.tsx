import React from 'react';
import css from './StatusItem.module.css';

import PlanImg from '../../../../../Assets/Images/Experimental/Plane.svg';

export default function StatusItem(): JSX.Element {
  return (
    <div className={css.ComponentContainer}>
      <div className={css.Content}>
        <div className={css.Title}>On your way to Silver Status!</div>
        <div className={css.FlightItem}>
          <div className={css.Progress}>
            <div className={css.Backward} style={{ width: '150px' }}>
              Tire miles
              <img src={PlanImg} alt="Plan" />
            </div>
          </div>
          <div className={css.FlightMiles}>
            <div className={css.MileValue}>9078</div>
            <div className={css.Description}>Tier miles remaining</div>
          </div>
        </div>
        <div className={css.FlightItem}>
          <div className={css.Progress}>
            <div className={css.Backward} style={{ width: '100px' }}>
              Tire segments
              <img src={PlanImg} alt="Plan" />
            </div>
          </div>
          <div className={css.FlightMiles}>
            <div className={css.MileValue}>14</div>
            <div className={css.Description}>Tier segments remaining</div>
          </div>
        </div>
      </div>
    </div>
  );
}
