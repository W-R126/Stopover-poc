import React from 'react';
import css from './BudgetDropDown.module.css';

interface BudgetDropDownProps {
  budget: number;
  changeBudget: Function;
  clickGo: Function;
}

export default function BudgetDropDown({
  budget,
  changeBudget,
  clickGo,
}: BudgetDropDownProps): JSX.Element {
  return (
    <div className={css.ComponentContainer}>
      <div className={css.Title}>What's your budget?</div>
      <div className={css.Budget}>{budget}</div>
      <input
        className={css.BudgetSlider}
        type="range"
        min={1}
        max={3000}
        value={budget}
        onChange={(e): void => {
          changeBudget(e.target.value);
        }}
      />
      <div className={css.LetsGoBtn} role="button" onClick={(): void => { clickGo(); }}>
        Let's go
      </div>
    </div>
  );
}
