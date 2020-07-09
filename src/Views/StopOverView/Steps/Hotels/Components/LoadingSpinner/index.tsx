import React from 'react';
import css from './LoadingSpinner.module.css';
import spinner from '../../../../../../Assets/Images/spinner.svg';

interface LoaindgSpinnerProps {
  loading: boolean;
}

export default function LoadingSpinner(props: LoaindgSpinnerProps): JSX.Element {
  const { loading } = props;
  return (
    <div className={`${css.Container} ${loading ? '' : css.Hidden}`}>
      <img src={spinner} alt="Loading Spinner" />
    </div>
  );
}
