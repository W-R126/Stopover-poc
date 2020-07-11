import React from 'react';

import css from './Progress.module.css';

export enum ProgressStep {
  flights = 'flights',
  passengers = 'passengers',
  extras = 'extras',
  payment = 'payment',
}

interface ProgressProps {
  step: ProgressStep;
}

export default function Progress(props: ProgressProps): JSX.Element {
  const progressStepLocale: { [key: string]: string } = {
    flights: 'Flights',
    passengers: 'Passengers',
    extras: 'Extras',
    payment: 'Payment',
  };

  const { step } = props;

  return (
    <div className={css.Progress}>
      {Object.keys(ProgressStep).map((progressStep, idx) => (
        <span
          key={`progress-step-${idx}`}
          className={step === progressStep ? css.Current : undefined}
        >
          {progressStepLocale[progressStep]}
        </span>
      ))}
    </div>
  );
}
