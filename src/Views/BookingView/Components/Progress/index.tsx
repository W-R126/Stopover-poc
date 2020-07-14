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
  const { step } = props;

  return (
    <div className={css.Progress}>
      {Object.keys(ProgressStep).map((progressStep, idx) => {
        let progressStepLabel;

        switch (progressStep) {
          case ProgressStep.flights:
            progressStepLabel = 'Flights';
            break;
          case ProgressStep.passengers:
            progressStepLabel = 'Passengers';
            break;
          case ProgressStep.extras:
            progressStepLabel = 'Extras';
            break;
          case ProgressStep.payment:
          default:
            progressStepLabel = 'Payment';
            break;
        }

        return (
          <span
            key={`progress-step-${idx}`}
            className={step === progressStep ? css.Current : undefined}
          >
            {progressStepLabel}
          </span>
        );
      })}
    </div>
  );
}
