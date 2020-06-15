import React from 'react';

import css from './DayRibbon.module.css';

interface DayRibbonProps {
  className?: string;
}

export default function DayRibbon({ className }: DayRibbonProps): JSX.Element {
  const classList = [css.DayRibbon];

  if (className) {
    classList.push(className);
  }

  return (
    <div className={classList.join(' ')}>
      <button type="button" className={css.NavigateBack}>
        Previous
      </button>
      {[1, 2, 3, 4, 5, 6, 7].map((day, idx) => (
        <div
          className={css.Day}
          key={`day-${idx}`}
          aria-selected={idx === 3}
        >
          <strong>AED 200</strong>
          <span>{`Tue ${day} May`}</span>
        </div>
      ))}
      <button type="button" className={css.NavigateForward}>
        Next
      </button>
    </div>
  );
}
