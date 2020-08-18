import React from 'react';
import css from './SearchInput.module.css';

import MicImg from '../../../../../../../Assets/Images/Experimental/Mic.svg';
import CloseImg from '../../../../../../../Assets/Images/Experimental/Close.svg';

import SearchDropDown from './Components/SearchDropDown';

import { SearchInputData } from '../../../../../MockData';
import BudgetDropDown from './Components/BudgetDropDown';
import FlightDropDown from './Components/FlightDropDown';
import ContentService from '../../../../../../../Services/ContentService';
import { GuestsModel } from '../../../../../../../Models/GuestsModel';

interface SearchInputProps {
  clickMic: Function;
  contentService: ContentService;
  selectedData: any;
  onChange: Function;
}

interface SearchInputState {
  menuList: any[];
  searchInputStr: string;
  isShowDropDown: boolean;
}

export default class SearchInput extends React.Component<
  SearchInputProps, SearchInputState
> {
  constructor(props: SearchInputProps) {
    super(props);
    this.state = {
      menuList: [],
      searchInputStr: '',
      isShowDropDown: false,
    };

    this.changeSearchStr = this.changeSearchStr.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.setItem = this.setItem.bind(this);
    this.setShowDropDown = this.setShowDropDown.bind(this);
  }

  private getFilteredMenuList(): any[] {
    const { searchInputStr } = this.state;
    if (searchInputStr.length > 0) {
      return SearchInputData.filter((item) => item.title.toLowerCase().indexOf(searchInputStr.toLowerCase()) >= 0);
    }
    return [];
  }

  private setItem(selectedOne: any): void {
    const { onChange } = this.props;
    let searchStr = '';
    let showDropDown = false;

    if (selectedOne.content.type === 2 || selectedOne.content.type === 3) {
      searchStr = selectedOne.title;
    }

    if (selectedOne.content.type === 2) { showDropDown = false; }
    if (selectedOne.content.type === 3) { showDropDown = true; }

    this.setState({
      searchInputStr: searchStr,
      isShowDropDown: showDropDown,
    });
    onChange({ ...selectedOne });
  }

  private setShowDropDown(bShow: boolean): void {
    this.setState({
      isShowDropDown: bShow,
    });
  }

  private cancelSearch(): void {
    const { onChange } = this.props;

    this.setState({
      searchInputStr: '',
      isShowDropDown: false,
    });

    onChange({});
  }

  private changeSearchStr(e: any): void {
    this.setState({
      searchInputStr: e.target.value,
      isShowDropDown: e.target.value.length > 0,
    });
  }

  private changeDate(dateInfo: any): void {
    const { selectedData, onChange } = this.props;
    onChange({
      ...selectedData,
      content: {
        ...selectedData.content,
        dateRange: {
          start: dateInfo.start,
          end: dateInfo.end,
        },
      },
    });
  }

  private changePassender(passengerInfo: GuestsModel): void {
    const { selectedData, onChange } = this.props;
    onChange({
      ...selectedData,
      content: {
        ...selectedData.content,
        passenger: {
          ...passengerInfo,
        },
      },
    });
  }

  private clickGo(): void {
    console.log('Budget Modal Click Go');
  }

  private renderItemDropDown(): JSX.Element|null {
    const { contentService, selectedData, onChange } = this.props;
    if (Object.keys(selectedData).length === 0) {
      return null;
    }
    if (selectedData.content.type === 0 || selectedData.content.type === 1) {
      return (
        <FlightDropDown
          flightData={selectedData}
          contentService={contentService}
          changeDate={(dateInfo: any): void => this.changeDate(dateInfo)}
          changePassenger={(passenger: any): void => this.changePassender(passenger)}
          setShowDropDown={this.setShowDropDown}
        />
      );
    } if (selectedData.content.type === 3) {
      return (
        <BudgetDropDown
          budget={selectedData.content.budget}
          changeBudget={(newValue: number): void => {
            onChange({
              ...selectedData,
              content: {
                ...selectedData.content,
                budget: newValue,
              },
            });
          }}
          clickGo={this.clickGo}
        />
      );
    } if (selectedData.content.type === 2) {
      return null;
    }
    return null;
  }

  render(): JSX.Element {
    const { searchInputStr, isShowDropDown } = this.state;
    const { clickMic, selectedData } = this.props;
    return (
      <div className={css.ComponentContainer}>
        <input
          className={isShowDropDown ? css.Open : ''}
          type="text"
          value={searchInputStr}
          onChange={this.changeSearchStr}
        />
        {Object.keys(selectedData).length > 0 && (
        <div className={css.CloseButton} role="button" onClick={this.cancelSearch}>
          <img src={CloseImg} alt="Format input string" />
        </div>
        )}
        <div
          className={css.InputMic}
          role="button"
          onClick={(): void => { clickMic(); }}
        >
          <img src={MicImg} alt="Mic" />
        </div>
        {(searchInputStr && isShowDropDown) && (
          <SearchDropDown
            menuList={this.getFilteredMenuList()}
            setItem={(selectedOne: any): void => { this.setItem(selectedOne); }}
          />
        )}
        {this.renderItemDropDown()}
      </div>
    );
  }
}
