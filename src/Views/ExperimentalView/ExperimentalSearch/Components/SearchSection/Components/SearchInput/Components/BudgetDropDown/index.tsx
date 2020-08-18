import React from 'react';
import css from './BudgetDropDown.module.css';

import RangeSlider from '../../../../../../../Components/RangeSlider';
import { get3DigitComma } from '../../../../../../../Utils';

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
      <div className={css.Budget}>{`AED ${get3DigitComma(budget)}`}</div>
      <RangeSlider
        className={css.BudgetSlider}
        min={1}
        max={3000}
        value={budget}
        onChange={(value: number): void => {
          changeBudget(value);
        }}
      />
      <div className={css.LetsGoBtn} role="button" onClick={(): void => { clickGo(); }}>
        Let's go
      </div>
    </div>
  );
}
