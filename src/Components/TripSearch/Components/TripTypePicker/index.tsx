import React from 'react';
import { TripTypeEnum } from '../../../../Enums/TripTypeEnum';

import css from './TripTypePicker.module.css';
import Radio from '../../../UI/Radio';

interface TripTypePickerProps {
  value: TripTypeEnum;
  onChange: (value: TripTypeEnum) => void;
  className?: string;
}

export default class TripTypePicker extends React.Component<TripTypePickerProps, {}> {
  constructor(props: TripTypePickerProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  private onChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const { onChange } = this.props;

    if (e.target.checked) {
      onChange(TripTypeEnum[e.target.value as keyof typeof TripTypeEnum]);
    }
  }

  render(): JSX.Element {
    const { value, className } = this.props;

    const classList = [css.TripTypePicker];

    if (className) {
      classList.push(className);
    }

    return (
      <ul className={classList.join(' ')}>
        <li>
          <Radio
            id="trip-type-return"
            name="trip-type"
            checked={value === TripTypeEnum.roundTrip}
            value={TripTypeEnum.roundTrip}
            onChange={this.onChange}
          >
            Return
          </Radio>
        </li>
        <li>
          <Radio
            id="trip-type-one-way"
            name="trip-type"
            checked={value === TripTypeEnum.oneWay}
            value={TripTypeEnum.oneWay}
            onChange={this.onChange}
          >
            One way
          </Radio>
        </li>
      </ul>
    );
  }
}
