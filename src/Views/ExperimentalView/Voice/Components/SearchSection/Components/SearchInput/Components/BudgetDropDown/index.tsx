import React from 'react';
import css from './BudgetDropDown.module.css';

interface BudgetDropDownProps {
  budget: number;
  changeBudget: Function;
}

export default function BudgetDropDown({
  budget,
  changeBudget,
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
        onChange={(e) => {
          changeBudget(e.target.value);
        }}
      />
      <div className={css.LetsGoBtn}>
        Let's go
      </div>
    </div>
  );
}
