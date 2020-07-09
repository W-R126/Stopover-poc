import React from 'react';
import closeIcon from '../../../../../../../../../../Assets/Images/close-btn.svg';
import CheckBox from '../CheckBox';
import css from './FilterMenu.module.css';
import { HOTEL_RATING_RANGE, HOTEL_AMENTITY_RANGE } from '../../../../../../Utils';

interface FilterMenuProps {
  filterValue: any;
  changeFilter: Function;
}
interface FilterMenuState {
  collapsed: boolean;
  price: number;
}

export default class FilterMenu extends React.Component<FilterMenuProps, FilterMenuState> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: FilterMenuProps) {
    super(props);
    this.state = {
      collapsed: true,
      price: props.filterValue.price,
    };
    this.handleChangePrice = this.handleChangePrice.bind(this);
    this.updateChnagrPrice = this.updateChnagrPrice.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('focusin', this.onClickOutside);
  }

  componentDidUpdate(prevProps: FilterMenuProps): void {
    const { filterValue } = this.props;
    if (prevProps.filterValue.price !== filterValue.price) {
      this.setState({
        price: filterValue.price,
      });
    }
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

  private changeCheckBoxValue = (itemId: string, strBox: string): void => {
    const { filterValue, changeFilter } = this.props;
    const filterValueTemp = { ...filterValue };
    if (strBox === 'hotelClass') {
      if (filterValueTemp.hotelClass.indexOf(itemId) >= 0) {
        filterValueTemp.hotelClass = filterValueTemp.hotelClass.filter(
          (item: string) => item !== itemId,
        );
      } else filterValueTemp.hotelClass.push(itemId);
    } else if (strBox === 'amentities') {
      if (filterValueTemp.amentities.indexOf(itemId) >= 0) {
        filterValueTemp.amentities = filterValueTemp.amentities.filter(
          (item: string) => item !== itemId,
        );
      } else filterValueTemp.amentities.push(itemId);
    }
    changeFilter(filterValueTemp);
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

  private handleChangePrice(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({
      price: parseFloat(event.target.value) === 100 ? -1 : parseFloat(event.target.value),
    });
  }

  private updateChnagrPrice(event: any): void {
    const { filterValue, changeFilter } = this.props;
    const value = parseFloat(event.target.value) === 100 ? -1 : parseFloat(event.target.value);
    changeFilter({
      ...filterValue,
      price: value,
    });
  }

  private renderAmentityClass(): JSX.Element[] {
    const renderTemp: JSX.Element[] = [];

    const { filterValue } = this.props;
    for (let i = 0; i < HOTEL_AMENTITY_RANGE.length; i += 3) {
      renderTemp.push(
        <div className={css.CheckBoxRow}>
          {
            HOTEL_AMENTITY_RANGE.map((item: any, nIndex: number) => {
              if (i <= nIndex && nIndex < i + 3) {
                return (
                  <div className={css.ChekcBoxItemDiv} key={item.title}>
                    <CheckBox
                      key={item.title}
                      changeValue={(): void => { this.changeCheckBoxValue(item.title, 'amentities'); }}
                      checked={filterValue.amentities.indexOf(item.title) >= 0}
                      label={item.title}
                    />
                  </div>
                );
              }
              return null;
            })
          }
        </div>,
      );
    }
    return renderTemp;
  }

  render(): JSX.Element {
    const { collapsed, price } = this.state;
    const { filterValue } = this.props;
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
          Filter
          <span className={css.AngleDown} />
        </div>
        {!collapsed
        && (
        <div className={css.Dropdown}>
          <div className={css.ContentHeader}>
            <p className={css.Title}>Filters</p>
            <div role="button" onClick={this.toggle}><img src={closeIcon} alt="Close Icon" /></div>
          </div>
          <div className={css.SliderContainer}>
            <p className={css.SubTitle}>
              {`Price ᛫ ${(price === 100 || price === -1) ? 'Any' : price}`}
            </p>
            <input
              type="range"
              min={0}
              max={100}
              value={price === -1 ? 100 : price}
              onChange={this.handleChangePrice}
              onMouseUp={this.updateChnagrPrice}
            />
          </div>

          <div className={css.HotelCalss}>
            <p className={css.SubTitle}>Hotel Class</p>
            <div className={css.CheckBoxRow}>
              {HOTEL_RATING_RANGE.map((item) => (
                <div className={css.ChekcBoxItemDiv} key={item}>
                  <CheckBox
                    key={item}
                    changeValue={(): void => { this.changeCheckBoxValue(item.toString(), 'hotelClass'); }}
                    checked={filterValue.hotelClass.indexOf(item.toString()) >= 0}
                    label={`${item}-star`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className={css.AmentityClass}>
            <p className={css.SubTitle}>Amentities</p>
            {this.renderAmentityClass()}
          </div>
        </div>
        )}
      </div>
    );
  }
}
