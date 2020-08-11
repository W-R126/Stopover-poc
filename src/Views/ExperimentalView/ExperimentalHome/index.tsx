import React from 'react';

import css from './ExperimentalHome.module.css';

import LogoImg from '../../../Assets/Images/Experimental/Logo-Etihad.png';

import ControlPlaneSvg from '../../../Assets/Images/Experimental/Manage your booking.svg';
import CheckSvg from '../../../Assets/Images/Experimental/Online Check in.svg';
import FlightStatusSvg from '../../../Assets/Images/Experimental/Flight Status.svg';
import SuitCaseSvg from '../../../Assets/Images/Experimental/Home-Suitcase.svg';
import UpgradeSvg from '../../../Assets/Images/Experimental/Upgrade.svg';

import SearchPanel from './Components/SearchPanel';

import ContentService from '../../../Services/ContentService';
import AirportService from '../../../Services/AirportService';

import { AirportModel } from '../../../Models/AirportModel';

interface ExperimentalHomeProps {
  contentService: ContentService;
  airportService: AirportService;
}

interface ExperimentalHomeState {
  selectedData: any;
}

class ExperimentalHome extends React.Component<ExperimentalHomeProps, ExperimentalHomeState> {
  constructor(props: ExperimentalHomeProps) {
    super(props);
    this.state = {
      selectedData: {
        origin: undefined,
        destination: undefined,
      },
    };

    this.onOriginDestinationChange = this.onOriginDestinationChange.bind(this);
  }

  private onOriginDestinationChange(origin?: AirportModel, destination?: AirportModel): void {
    const { selectedData } = this.state;
    this.setState({
      selectedData: {
        ...selectedData,
        origin,
        destination,
      },
    });
  }

  render(): JSX.Element {
    const { airportService } = this.props;
    const { selectedData } = this.state;
    return (
      <div className={css.ComponentContainer}>
        <div className={css.Header}>
          <a href="">
            <img src={LogoImg} alt="Etihad Logo" />
          </a>
        </div>
        <div className={css.SearchSection}>
          <SearchPanel
            airportService={airportService}
            origin={selectedData.origin}
            destination={selectedData.destination}
            onChange={this.onOriginDestinationChange}
          />
        </div>
        <div className={css.ControlSection}>
          <div className={css.ControlItem}>
            <img src={ControlPlaneSvg} alt="control plane svg" />
            Manage booking
          </div>
          <div className={css.ControlItem}>
            <img src={CheckSvg} alt="control checkin svg" />
            Check-in
          </div>
          <div className={css.ControlItem}>
            <img src={FlightStatusSvg} alt="control flight status svg" />
            Flight status
          </div>
          <div className={css.ControlItem}>
            <img src={SuitCaseSvg} alt="control baggage svg" />
            Baggage guide
          </div>
          <div className={css.ControlItem}>
            <img src={UpgradeSvg} alt="control upgrade svg" />
            Upgrade
          </div>
        </div>
      </div>
    );
  }
}

export default ExperimentalHome;
