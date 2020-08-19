import React from 'react';
import css from './SearchDropDown.module.css';

import MenuIcon1 from '../../../../../../../../../Assets/Images/Experimental/Menu-Icon1.svg';
import MenuIcon2 from '../../../../../../../../../Assets/Images/Experimental/Menu-Icon2.svg';
import MenuIcon3 from '../../../../../../../../../Assets/Images/Experimental/Menu-Icon3.svg';
import TowerIcon from '../../../../../../../../../Assets/Images/Experimental/Towers.svg';
import SuitCaseIcon from '../../../../../../../../../Assets/Images/Experimental/Suitcase.svg';

interface SearchDropDownProps {
  menuList: any[];
  setItem: Function;
}

export default function SearchDropDown({ menuList, setItem }: SearchDropDownProps): JSX.Element {
  const renderDetailItem = (item: any): JSX.Element | null => {
    if (menuList.length <= 2) {
      if (item.content.type === 0 || item.content.type === 1) {
        return (
          <>
            <div className={css.Details}>
              <div className={css.Item}>
                {`${item.content.segment[0].Depature} - ${item.content.segment[0].Arrival}`}
              </div>
              <div className={css.Item}>
                {`${item.content.segment[0].Stops} Stop`}
              </div>
              <div className={css.Item}>
                {`${item.content.segment[0].Duration} Travel Time`}
              </div>
            </div>
            <div className={css.Description}>
              <img src={TowerIcon} alt="Tower" />
              {item.content.Description}
            </div>
          </>
        );
      } if (item.content.type === 2) {
        return (
          <div className={css.Details}>
            <img className={css.Suitcase} src={SuitCaseIcon} alt="suitcase" />
            {`${item.content.answer} ${item.content.weight}kg`}
          </div>
        );
      }
      return null;
    }
    return null;
  };

  return (
    <div className={css.ComponentContainer}>
      <div className={css.ContentDiv}>
        {menuList.length === 0 && <div className={css.EmptyItem}>No Data</div>}
        {menuList.map((item: any, idx: number): JSX.Element => (
          <div
            className={css.MenuItem}
            onClick={(): void => setItem(item)}
            role="button"
            key={idx}
          >
            <div className={css.MainContent}>
              <div className={css.IconDiv}>
                {item.iconType === 0 && <img src={MenuIcon1} alt="Icon1" />}
                {item.iconType === 1 && <img src={MenuIcon2} alt="Icon2" />}
                {(item.iconType === 2 || item.iconType === 3) && <img src={MenuIcon3} alt="Icon3" />}
              </div>
              <div className={css.Title}>{item.title}</div>
            </div>
            {renderDetailItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
