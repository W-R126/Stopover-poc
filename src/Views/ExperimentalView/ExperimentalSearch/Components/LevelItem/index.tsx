import React from 'react';
import css from './LevelItem.module.css';

import LevelBgImg from '../../../../../Assets/Images/Experimental/Level-bg.svg';

import { get3DigitComma } from '../../../Utils';

export default function LevelItem(): JSX.Element {
  return (
    <div className={css.ComponentContainer}>
      <div className={css.Content}>
        <img className={css.Back} src={LevelBgImg} alt="back" />
        <div className={css.LevelDetail}>
          <span>
            Tier level:
            {' '}
            <span className={css.Value}>Platinum</span>
          </span>
          <span className={css.LevelId}>157392705629</span>
        </div>
        <div className={css.Name}>John Smith</div>
        <div className={css.Details}>
          <div className={css.DetailItem}>
            <div className={css.Title}>Tier Miles</div>
            <div className={css.Value}>{get3DigitComma(125000)}</div>
          </div>
          <div className={css.DetailItem}>
            <div className={css.Title}>Guest Miles</div>
            <div className={css.Value}>{get3DigitComma(129350)}</div>
          </div>
          <div className={css.DetailItem}>
            <div className={css.Title}>Tier Segments</div>
            <div className={css.Value}>{get3DigitComma(60)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
