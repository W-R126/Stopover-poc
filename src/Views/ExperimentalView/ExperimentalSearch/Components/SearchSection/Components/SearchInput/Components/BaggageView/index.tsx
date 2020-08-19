import React from 'react';
import css from './BaggageView.module.css';

import SuitCaseIcon from '../../../../../../../../../Assets/Images/Experimental/Suitcase.svg';

interface BaggageViewProps {
  data: any;
}
export default function BaggageView({ data }: BaggageViewProps): JSX.Element {
  return (
    <div className={css.ComponentContainer}>
      <img src={SuitCaseIcon} alt="Suitcase" />
      <span className={css.Answer}>
        {`${data.content.answer} ${data.content.weight}kg : `}
      </span>
      {`${data.title}?`}
    </div>
  );
}
