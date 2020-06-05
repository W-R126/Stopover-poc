import React from 'react';

import './DayRibbon.css';

export default function DayRibbon(): JSX.Element {
  return (
    <div className="day-ribbon">
      <button type="button" className="navigate-back">
        Previous
      </button>
      {[1, 2, 3, 4, 5, 6, 7].map((day, idx) => (
        <div className={`day day-${idx}${idx === 3 ? ' selected' : ''}`} key={`day-${idx}`}>
          <strong>AED 200</strong>
          <span>{`Tue ${day} May`}</span>
        </div>
      ))}
      <button type="button" className="navigate-forward">
        Next
      </button>
    </div>
  );
}
