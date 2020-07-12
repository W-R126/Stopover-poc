import React from 'react';
import css from './CheckBox.module.css';
import checkedIcon from '../../../../../../../../Assets/Images/checked-icon-white.svg';

interface CheckBoxProps {
  checked: boolean;
  changeValue: any;
  label: string;
}

export default class CheckBox extends React.Component<CheckBoxProps, {}> {
  constructor(props: CheckBoxProps) {
    super(props);
    this.handleClickCheck = this.handleClickCheck.bind(this);
  }

  private handleClickCheck(): void {
    const { changeValue } = this.props;
    changeValue();
  }

  render(): JSX.Element {
    const { checked, label } = this.props;
    return (
      <div
        className={css.Container}
        onClick={this.handleClickCheck}
        role="button"
      >
        <div className={`${css.CheckDiv} ${checked ? css.Checked : ''}`} role="button">
          <img src={checkedIcon} alt="checkIcon" />
        </div>
        <label>{label}</label>
      </div>
    );
  }
}
