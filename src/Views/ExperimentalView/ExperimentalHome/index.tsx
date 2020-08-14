import React from 'react';

import css from './ExperimentalHome.module.css';

import LogoImg from '../../../Assets/Images/Experimental/Logo-Etihad.png';

import ControlPlaneSvg from '../../../Assets/Images/Experimental/Manage your booking.svg';
import CheckSvg from '../../../Assets/Images/Experimental/Online Check in.svg';
import FlightStatusSvg from '../../../Assets/Images/Experimental/Flight Status.svg';
import SuitCaseSvg from '../../../Assets/Images/Experimental/Home-Suitcase.svg';
import UpgradeSvg from '../../../Assets/Images/Experimental/Upgrade.svg';

import BgImg1 from '../../../Assets/Images/Experimental/Back-4.jpg';
import BgImg2 from '../../../Assets/Images/Experimental/Back-5.jpg';
import BgImg3 from '../../../Assets/Images/Experimental/Back-6.jpg';

import SearchPanel from './Components/SearchPanel';
import InfoItem from './Components/InfoItem';

import ContentService from '../../../Services/ContentService';
import AirportService from '../../../Services/AirportService';

import { AirportModel } from '../../../Models/AirportModel';
import { GuestsModel } from '../../../Models/GuestsModel';
import { CabinClassEnum } from '../../../Enums/CabinClassEnum';
import { TripTypeEnum } from '../../../Enums/TripTypeEnum';

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
        dateRange: {
          start: undefined,
          end: undefined,
        },
        passenger: {
          adults: 1,
          children: 0,
          infants: 0,
        },
        cabinClass: CabinClassEnum.economy,
        price: 380,
        tripType: TripTypeEnum.roundTrip,
      },
    };

    this.onChangeAirports = this.onChangeAirports.bind(this);
    this.onChangeDateRange = this.onChangeDateRange.bind(this);
    this.onChangePassenger = this.onChangePassenger.bind(this);
    this.onChangeCabinClass = this.onChangeCabinClass.bind(this);
    this.onChangePrice = this.onChangePrice.bind(this);
    this.onChangeTripType = this.onChangeTripType.bind(this);
  }

  private onChangeAirports(origin?: AirportModel, destination?: AirportModel): void {
    const { selectedData } = this.state;
    this.setState({
      selectedData: {
        ...selectedData,
        origin,
        destination,
      },
    });
  }

  private onChangeDateRange(start?: Date, end?: Date): void {
    const { selectedData } = this.state;

    this.setState({
      selectedData: {
        ...selectedData,
        dateRange: {
          start,
          end,
        },
      },
    });
  }

  private onChangePassenger(passenger: GuestsModel): void {
    const { selectedData } = this.state;
    this.setState({
      selectedData: {
        ...selectedData,
        passenger: {
          ...passenger,
        },
      },
    });
  }

  private onChangeCabinClass(cabinClass: CabinClassEnum): void {
    const { selectedData } = this.state;
    this.setState({
      selectedData: {
        ...selectedData,
        cabinClass,
      },
    });
  }

  private onChangePrice(value: number): void {
    const { selectedData } = this.state;
    this.setState({
      selectedData: {
        ...selectedData,
        price: value,
      },
    });
  }

  private onChangeTripType(value: TripTypeEnum): void {
    const { selectedData } = this.state;
    if (value === TripTypeEnum.oneWay) {
      this.setState({
        selectedData: {
          ...selectedData,
          tripType: value,
          dateRange: {
            ...selectedData.dateRange,
            end: undefined,
          },
          destination: undefined,
        },
      });
    } else if (value === TripTypeEnum.roundTrip) {
      this.setState({
        selectedData: {
          ...selectedData,
          tripType: value,
        },
      });
    }
  }

  render(): JSX.Element {
    const { airportService, contentService } = this.props;
    const { selectedData } = this.state;
    return (
      <div className={css.ComponentContainer}>
        <div className={css.Header}>
          <div className={css.Logo}>
            <img src={LogoImg} alt="Etihad Logo" />
          </div>
        </div>
        <div className={css.SearchSection}>
          <SearchPanel
            airportService={airportService}
            contentService={contentService}
            origin={selectedData.origin}
            destination={selectedData.destination}
            onChangeAirports={this.onChangeAirports}
            dateRange={selectedData.dateRange}
            onChangeDateRange={this.onChangeDateRange}
            passenger={selectedData.passenger}
            onChangePassenger={this.onChangePassenger}
            cabinClass={selectedData.cabinClass}
            onChangeCabinClass={this.onChangeCabinClass}
            price={selectedData.price}
            onChangePrice={this.onChangePrice}
            tripType={selectedData.tripType}
            onChangeTripType={this.onChangeTripType}
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
        <div className={css.InfoContainer}>
          <InfoItem
            title="Visit Abu Dhabi with Etihad"
            description="Proudly modern and cosmopolitan, Abu Dhabi is the UAE's forward-thinking cultural heart where nothing stands still."
            climate="March: 25-30°C · Pleasant and breezy"
            srcImg={BgImg1}
            tellMe
            style={{ flex: '1 1 50%', height: '400px' }}
          />
          <InfoItem
            title="The Louvre Abu Dhabi"
            description="With floating markets on the river, fascinating temples and vibrant streets with friendly locals, Bangkok is a must-see."
            srcImg={BgImg2}
            tellMe
            style={{ flex: '1 1 50%', height: '400px' }}
          />
          <InfoItem
            title="Experience the Formula 1 Etihad Airways Abu Dhabi Grand Prix 2020"
            duration="November 27-29"
            srcImg={BgImg3}
            learnMore
            style={{ flex: '1 1 100%', height: '300px' }}
          />
        </div>
      </div>
    );
  }
}

export default ExperimentalHome;
