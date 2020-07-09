import React from 'react';
import css from './NightSelector.module.css';
import OtherNightMenu from './Components/OtherNightMenu';

interface NightMenuProps {
  selectedNight: number;
  changeNight: Function;
  stopoverDays: number[];
}

export default class NightSelector extends React.Component<NightMenuProps, {}> {
  constructor(props: any) {
    super(props);
    this.handleClickNight = this.handleClickNight.bind(this);
  }

  private handleClickNight(selectedOne: number): void {
    const { changeNight } = this.props;
    changeNight(selectedOne);
  }

  private renderButtons(): JSX.Element[] {
    const { selectedNight, stopoverDays } = this.props;
    const renderButtons: JSX.Element[] = [];
    stopoverDays.forEach((item, nIndex) => {
      if (nIndex < 3) {
        renderButtons.push(
          <button
            type="button"
            className={selectedNight === item ? css.Active : ''}
            onClick={(): void => { this.handleClickNight(item); }}
            key={item}
          >
            {`${item} Nights`}
          </button>,
        );
      }
    });
    return renderButtons;
  }

  render(): JSX.Element {
    const { selectedNight, changeNight, stopoverDays } = this.props;
    return (
      <>
        <h3 className={css.Heading}>
          Select the number of Abu Dhabi stopover nights, then choose your
          hotel and onward flight.
        </h3>
        <p className={css.SubHeading}>I want to stopover for:</p>
        <div className={css.ButtonsWrap}>
          {this.renderButtons()}
          <OtherNightMenu
            selectedNight={selectedNight}
            stopoverDays={stopoverDays}
            changeNight={
              (selectedOne: number): void => { changeNight(selectedOne); }
            }
          />
        </div>
      </>
    );
  }
}
