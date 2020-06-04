import React from 'react';

import './Progress.css';

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
    <div className="progress">
      {Object.keys(ProgressStep).map((progressStep, idx) => (
        <span
          key={`progress-step-${idx}`}
          className={step === (ProgressStep as any)[progressStep] ? 'current' : undefined}
        >
          {progressStepLocale[progressStep]}
        </span>
      ))}
    </div>
  );
}
