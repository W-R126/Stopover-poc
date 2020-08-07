import React from 'react';
import css from './SearchInput.module.css';

import MicImg from '../../../../../../../Assets/Images/Experimental/Mic.svg';
import CloseImg from '../../../../../../../Assets/Images/Experimental/Close.svg';

import DropDown from './Components/DropDown';

import { SearchInputData } from '../../../../../MockData';
import BudgetDropDown from './Components/BudgetDropDown';

interface SearchInputProps {
  clickMic: Function;
}

interface SearchInputState {
  menuList: any[];
  searchInputStr: string;
  selectedData: any;
}

export default class SearchInput extends React.Component<
  SearchInputProps, SearchInputState
> {
  constructor(props: SearchInputProps) {
    super(props);
    this.state = {
      menuList: [],
      searchInputStr: '',
      selectedData: {},
    };

    this.changeSearchStr = this.changeSearchStr.bind(this);
    this.cancelSearch = this.cancelSearch.bind(this);
    this.setItem = this.setItem.bind(this);
  }

  private getFilteredMenuList(): any[] {
    const { searchInputStr } = this.state;
    if (searchInputStr.length > 0) {
      return SearchInputData.filter((item) => item.title.toLowerCase().indexOf(searchInputStr.toLowerCase()) >= 0);
    }
    return [];
  }

  private setItem(selectedOne: any): void {
    this.setState({
      selectedData: { ...selectedOne },
      searchInputStr: selectedOne.title,
    });
  }

  private cancelSearch(): void {
    this.setState({
      searchInputStr: '',
      selectedData: {},
    });
  }

  private changeSearchStr(e: any): void {
    this.setState({
      searchInputStr: e.target.value,
    });
  }

  private renderItemDropDown(): JSX.Element|null {
    const { selectedData } = this.state;
    if (Object.keys(selectedData).length === 0) { return null; }
    if (selectedData.content.type === 3) {
      return (
        <BudgetDropDown
          budget={selectedData.content.budget}
          changeBudget={(newValue: number): void => {
            this.setState({
              selectedData: {
                ...selectedData,
                content: {
                  ...selectedData.content,
                  budget: newValue,
                },
              },
            });
          }}
        />
      );
    } if (selectedData.content.type === 2) {
      return null;
    }
    return null;
  }

  render(): JSX.Element {
    const { searchInputStr } = this.state;
    const { clickMic } = this.props;
    return (
      <div className={css.ComponentContainer}>
        <input
          className={searchInputStr.length > 0 ? css.Open : ''}
          type="text"
          value={searchInputStr}
          onChange={this.changeSearchStr}
        />
        {searchInputStr.length > 0 && (
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
        {searchInputStr && (
        <DropDown
          menuList={this.getFilteredMenuList()}
          setItem={(selectedOne: any) => { this.setItem(selectedOne); }}
        />
        )}
        {this.renderItemDropDown()}
      </div>
    );
  }
}
