import React from 'react';
import { Link } from 'react-router-dom';

import css from './Header.module.css';
import etihadLogo from '../../Assets/Images/header-text-image-web.svg';
import openExternal from '../../Assets/Images/open-external.svg';
import searchIcon from '../../Assets/Images/search-icon.svg';
import account from '../../Assets/Images/account.svg';

export default function Header(): JSX.Element {
  return (
    <>
      <header className={css.Header}>
        <div className={`${css.ContentWrapper} content-wrapper`}>
          <Link to="/" className={css.Logo}>
            <img src={etihadLogo} alt="Etihad Logo" />
          </Link>
          <nav>
            <Link to="/">Book</Link>
            <Link to="/">Fly Etihad</Link>
            <Link to="/">Manage</Link>
            <Link to="/">Destinations</Link>
            <Link to="/">Help</Link>
            <Link to="/" className="external-link">
              Etihad Guest
              <img src={openExternal} alt="Open external" />
            </Link>
            <Link to="/">
              <img src={searchIcon} alt="Search" />
            </Link>
            <Link to="/">
              <img src={account} alt="Account" />
            </Link>
          </nav>
        </div>
      </header>
      <div className={css.HeaderSpacer} />
    </>
  );
}
