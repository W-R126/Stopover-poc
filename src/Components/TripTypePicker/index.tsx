import React from 'react';
import { TripType } from '../../Types/TripType';

import './TripTypePicker.css';
import Radio from '../UI/Radio';

interface TripTypePickerProps {
  value: TripType;
  onChange: (value: TripType) => void;
}

export default class TripTypePicker extends React.Component<TripTypePickerProps, {}> {
  constructor(props: TripTypePickerProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  private onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { onChange } = this.props;

    if (e.target.checked) {
      onChange(e.target.value as TripType);
    }
  }

  render(): JSX.Element {
    const { value } = this.props;

    return (
      <ul className="trip-type-picker">
        <li>
          <Radio
            id="trip-type-return"
            name="trip-type"
            checked={value === 'return'}
            value="return"
            onChange={this.onChange}
          >
            Return
          </Radio>
        </li>
        <li>
          <Radio
            id="trip-type-one-way"
            name="trip-type"
            checked={value === 'oneWay'}
            value="oneWay"
            onChange={this.onChange}
          >
            One way
          </Radio>
        </li>
        <li>
          <Radio
            id="trip-type-multi-city"
            name="trip-type"
            checked={value === 'multiCity'}
            value="multiCity"
            onChange={this.onChange}
          >
            Multi city
          </Radio>
        </li>
      </ul>
    );
  }
}
