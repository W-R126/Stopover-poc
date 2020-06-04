import React from 'react';
import { TripType } from '../../Enums/TripType';

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
      onChange((TripType as any)[e.target.value]);
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
            checked={value === TripType.return}
            value={TripType.return}
            onChange={this.onChange}
          >
            Return
          </Radio>
        </li>
        <li>
          <Radio
            id="trip-type-one-way"
            name="trip-type"
            checked={value === TripType.oneway}
            value={TripType.oneway}
            onChange={this.onChange}
          >
            One way
          </Radio>
        </li>
        <li>
          <Radio
            id="trip-type-multi-city"
            name="trip-type"
            checked={value === TripType.multicity}
            value={TripType.multicity}
            onChange={this.onChange}
          >
            Multi city
          </Radio>
        </li>
      </ul>
    );
  }
}
