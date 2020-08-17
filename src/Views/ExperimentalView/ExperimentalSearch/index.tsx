import React from 'react';
import css from './ExperimentalSearch.module.css';

import LogoImg from '../../../Assets/Images/Experimental/Logo-Etihad.png';
import AccountImg from '../../../Assets/Images/Experimental/Account.svg';
import BgImg1 from '../../../Assets/Images/Experimental/Back-1.jpg';
import BgImg2 from '../../../Assets/Images/Experimental/Back-2.jpg';
import BgImg3 from '../../../Assets/Images/Experimental/Back-3.jpg';

import SearchSection from './Components/SearchSection';
import LevelItem from './Components/LevelItem';
import StatusItem from './Components/StatusItem';
import FlightItem from './Components/FlightItem';
import ExperienceItem from './Components/ExperienceItem';
import ContentService from '../../../Services/ContentService';

interface ExperimentalSearchProps {
  contentService: ContentService;
}

interface ExperimentalSearchState {
  selectedData: any;
}

class ExperimentalSearch extends React.Component<
  ExperimentalSearchProps, ExperimentalSearchState
> {
  constructor(props: ExperimentalSearchProps) {
    super(props);
    this.state = {
      selectedData: {},
    };
    this.setSelectedData = this.setSelectedData.bind(this);
  }

  private setSelectedData(newData: any): void {
    this.setState({
      selectedData: { ...newData },
    });
  }

  private renderFirstItem(): JSX.Element {
    const { selectedData } = this.state;

    if (selectedData.content && selectedData.content.type && selectedData.content.type === 0) {
      return <StatusItem />;
    } return <LevelItem />;
  }

  render(): JSX.Element {
    const { contentService } = this.props;
    const { selectedData } = this.state;

    return (
      <div className={css.MainContainer}>
        <div className={css.Container}>
          <div className={css.Header}>
            <div className={css.Logo}>
              <img src={LogoImg} alt="logo" />
            </div>
            <div className={css.Account}>
              <img src={AccountImg} alt="account" />
            </div>
          </div>
          <SearchSection
            contentService={contentService}
            selectedData={selectedData}
            onChange={this.setSelectedData}
          />
          <div className={css.InfoContainer}>
            {this.renderFirstItem()}
            <FlightItem />
            <ExperienceItem
              title="Beijing"
              subTitle="From £890 "
              description="Beijing is an enthralling clash of personalities. Traditional but tech-forward, it’s a megacity marching into the future."
              climate="November: 18-25°C · Pleasant and breezy"
              srcImg={BgImg1}
            />
            <ExperienceItem
              title="Experience the Formula 1 Etihad"
              duration="November 27-29"
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
}

export default ExperimentalSearch;
