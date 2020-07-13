import React from 'react';
import checkedIcon from '../../../../../../../../Assets/Images/checked-icon.svg';
import css from './OtherNightMenu.module.css';

interface OtherNightMenuState {
  collapsed: boolean;
}

interface OtherNightMenuProps {
  selectedNight?: number;
  changeNight: Function;
  stopoverDays: number[];
}

export default class OtherNightMenu extends React.Component<
  OtherNightMenuProps, OtherNightMenuState
> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  private readonly STOPOVERDAYS_RANGE = Array.from(Array(7).keys()).map((item) => item + 1);

  constructor(props: OtherNightMenuProps) {
    super(props);
    this.state = {
      collapsed: true,
    };
    this.onClickOutside = this.onClickOutside.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleClickNight = this.handleClickNight.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('focusin', this.onClickOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
    document.addEventListener('focusin', this.onClickOutside);
  }

  private onClickOutside(e: any): void {
    if (!this.selfRef.current || this.selfRef.current.contains(e.target)) {
      return;
    }

    this.collapse();
  }

  private setHeaderTitle(): string {
    const { selectedNight, stopoverDays } = this.props;
    if (stopoverDays.indexOf(selectedNight ?? 0) >= 3) return `${selectedNight} Nights`;
    return 'Other Options';
  }

  private collapse(): void {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.setState({ collapsed: true });
    }
  }

  private expand(): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.setState({ collapsed: false });
    }
  }

  private toggle(): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  private handleClickNight(selectedOne: number): void {
    const { changeNight } = this.props;

    changeNight(selectedOne);

    setTimeout(() => {
      this.toggle();
    }, 100);
  }

  private checkActive(): boolean {
    const { selectedNight, stopoverDays } = this.props;
    if (stopoverDays.indexOf(selectedNight ?? 0) >= 3) return true;
    return false;
  }

  render(): JSX.Element {
    const { collapsed } = this.state;
    const { selectedNight, stopoverDays } = this.props;

    return (
      <div
        className={css.Container}
        ref={this.selfRef}
        aria-expanded={!collapsed}
        role="button"
      >
        <button
          type="button"
          onClick={this.toggle}
          className={`${this.checkActive() ? css.Active : ''}`}
        >
          {this.setHeaderTitle()}
        </button>
        {!collapsed
        && (
        <div className={css.Dropdown}>
          {
            this.STOPOVERDAYS_RANGE.map((item) => (
              <div
                className={`${css.DropdownItem} ${stopoverDays.indexOf(item) >= 0 ? '' : css.NoAvailable}`}
                onClick={(): void => {
                  if (stopoverDays.indexOf(item) >= 0) { this.handleClickNight(item); }
                }}
                key={item}
                role="button"
              >
                {selectedNight === item && <img src={checkedIcon} alt="Checked Icon" />}

                {`${item} Night${item > 1 ? 's' : ''}`}
                {(stopoverDays.indexOf(item) >= 0 && (item >= 2 && item <= 5))
                  && (
                  <span className={css.Recommended}>
                    Recommended
                  </span>
                  )}
                {!(stopoverDays.indexOf(item) >= 0)
                  && <span className={css.NoAvailable}>No flights available</span>}
              </div>
            ))
          }
        </div>
        )}
      </div>
    );
  }
}
