import React from 'react';
import css from './BudgetDropDown.module.css';

import RangeSlider from '../../../../../../../Components/RangeSlider';
import { get3DigitComma } from '../../../../../../../Utils';

interface BudgetDropDownProps {
  title: string;
  budget: number;
  changeBudget: Function;
  clickGo: Function;
  isShowDropDown: boolean;
}

export default function BudgetDropDown({
  title,
  budget,
  changeBudget,
  clickGo,
  isShowDropDown,
}: BudgetDropDownProps): JSX.Element {
  return (
    <>
      <div className={css.TopHeader}>
        {title}
        {' '}
        <span className={css.Price}>
          AED,
          {budget}
        </span>
      </div>
      {isShowDropDown
      && (
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
        <div className={css.LetsGoBtn} role="button" onClick={(): void => { clickGo(false); }}>
          Let's go
        </div>
      </div>
      )}
    </>
  );
}
