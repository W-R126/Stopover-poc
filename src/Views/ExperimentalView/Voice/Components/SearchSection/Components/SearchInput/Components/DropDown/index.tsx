import React from 'react';
import css from './DropDown.module.css';

import MenuIcon1 from '../../../../../../../../../Assets/Images/Experimental/Menu-Icon1.svg';
import MenuIcon2 from '../../../../../../../../../Assets/Images/Experimental/Menu-Icon2.svg';
import MenuIcon3 from '../../../../../../../../../Assets/Images/Experimental/Menu-Icon3.svg';

interface DropDownProps {
  menuList: any[];
  setItem: Function;
}

export default function DropDown({ menuList, setItem }: DropDownProps): JSX.Element {
  return (
    <div className={css.ComponentContainer}>
      <div className={css.ContentDiv}>
        {menuList.length === 0 && <div className={css.EmptyItem}>No Data</div>}
        {menuList.map((item: any): JSX.Element => (
          <div
            className={css.MenuItem}
            onClick={() => setItem(item)}
            role="button"
          >
            <div className={css.IconDiv}>
              {item.content.type === 0 && <img src={MenuIcon1} alt="Icon1" />}
              {item.content.type === 1 && <img src={MenuIcon2} alt="Icon2" />}
              {(item.content.type === 2 || item.content.type === 3) && <img src={MenuIcon3} alt="Icon3" />}
            </div>
            <div className={css.Title}>{item.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
