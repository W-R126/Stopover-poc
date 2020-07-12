import React from 'react';
import checkedIcon from '../../../../../../../../Assets/Images/checked-icon.svg';
import css from './SortMenu.module.css';
import { HOTEL_SORT_RANGE } from '../../../../Utils';

interface SortMenuState {
  collapsed: boolean;
}

interface SortMenuProps {
  selectedSort: string;
  changeSort: Function;
}

export default class SortMenu extends React.Component<SortMenuProps, SortMenuState> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: SortMenuProps) {
    super(props);
    this.state = {
      collapsed: true,
    };
    this.onClickOutside = this.onClickOutside.bind(this);
    this.toggle = this.toggle.bind(this);
    this.handleClickSortItem = this.handleClickSortItem.bind(this);
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

  private toggle(): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  private expand(): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.setState({ collapsed: false });
    }
  }

  private collapse(): void {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.setState({ collapsed: true });
    }
  }

  private handleClickSortItem(selectedOne: string): void {
    const { changeSort } = this.props;
    changeSort(selectedOne);
    setTimeout(() => {
      this.toggle();
    }, 100);
  }

  render(): JSX.Element {
    const { collapsed } = this.state;
    const { selectedSort } = this.props;
    return (
      <div
        className={css.Container}
        ref={this.selfRef}
        aria-expanded={!collapsed}
        role="button"
      >
        <div
          className={css.Header}
          onClick={this.toggle}
          role="button"
        >
          Sort by
          <span className={css.AngleDown} />
        </div>
        {!collapsed
        && (
        <div className={css.Dropdown}>
          {HOTEL_SORT_RANGE.map((item, nIndex) => (
            <div
              className={css.DropdownItem}
              onClick={(): void => { this.handleClickSortItem(item); }}
              key={nIndex}
              role="button"
            >
              {selectedSort.toLowerCase() === item.toLowerCase() && <img src={checkedIcon} alt="Checked Icon" />}
              {item}
            </div>
          ))}
        </div>
        )}
      </div>
    );
  }
}
