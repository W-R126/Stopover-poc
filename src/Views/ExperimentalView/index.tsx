import React from 'react';
import css from './Experimental.module.css';

import LogoImg from '../../Assets/Images/Experimental/Logo-Etihad.png';
import AccountImg from '../../Assets/Images/Experimental/Account.svg';
import BgImg1 from '../../Assets/Images/Experimental/Back-1.jpg';
import BgImg2 from '../../Assets/Images/Experimental/Back-2.jpg';
import BgImg3 from '../../Assets/Images/Experimental/Back-3.jpg';

import SearchSection from './Components/SearchSection';
import LevelItem from './Components/LevelItem';
import FlightItem from './Components/FlightItem';
import ExperienceItem from './Components/ExperienceItem';

export default function ExperimentalView(): JSX.Element {
  return (
    <div className={css.MainContainer}>
      <div className={css.Container}>
        <div className={css.Header}>
          <a className={css.Logo} href="">
            <img src={LogoImg} alt="logo" />
          </a>
          <a className={css.Account} href="">
            <img src={AccountImg} alt="account" />
          </a>
        </div>
        <SearchSection isSearch={false} />
        <div className={css.InfoContainer}>
          <LevelItem />
          <FlightItem />
          <ExperienceItem
            title="Beijing"
            subTitle="From AED 2,255"
            description="Beijing is an enthralling clash of personalities. Traditional but tech-forward, it’s a megacity marching into the future."
            climate="May: 18-25°C · Pleasant and breezy"
            srcImg={BgImg1}
          />
          <ExperienceItem
            title="Experience the Formula 1 Etihad"
            subTitle="November 27-29"
            srcImg={BgImg2}
          />
          <ExperienceItem
            title="W Abu Dhabi, Yas Island"
            subTitle="2 nights from AED 1255"
            description="From sunrise treats to sunset rituals, W Abu Dhabi – Yas Island is your go-to for all things local."
            srcImg={BgImg3}
          />
        </div>
      </div>
    </div>
  );
}
