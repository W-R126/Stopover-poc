import React from 'react';

import css from './RangeSlider.module.css';

interface RangeSliderProps {
  className?: string;
  value: number;
  onChange: Function;
  min: number;
  max: number;
}

export default function RangeSlider({
  className,
  value,
  onChange,
  min,
  max,
}: RangeSliderProps): JSX.Element {
  const classList = [css.RangeSlider];
  if (className) { classList.push(className); }

  return (
    <input
      className={classList.join(' ')}
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e): void => {
        onChange(e.target.value);
      }}
    />
  );
}
