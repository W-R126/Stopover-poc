import React from 'react';
import css from './FlightItem.module.css';
import PlanSvg from '../../../../../../Assets/Images/NDC/plan-white.svg';
import PlanBlackRightSvg from '../../../../../../Assets/Images/NDC/plan-black-right.svg';
import BrandSvg from '../../../../../../Assets/Images/NDC/Etihad Tailfin.svg';
import ContentService from '../../../../Services/ContentService';
import FlightModels from '../../../../../../Services/Content/FlightModels';
import { FlightItemModel, PaxSegment } from '../../../../Models/NDCModel';
import { AirportModel } from '../../../../../../Models/AirportModel';

interface FlihghtItemProps {
  flightItem: FlightItemModel;
  contentService: ContentService;
  label: string;
  airports?: AirportModel[];
}

export default class FlightItem extends React.Component<FlihghtItemProps, {}> {
  private getHeaderDay(): string {
    const { contentService, flightItem } = this.props;
    const { paxSegment } = flightItem;
    const startDate = new Date(paxSegment[0].Dep.AircraftScheduledDateTime);

    const startDateStr = startDate.toLocaleDateString(
      contentService.locale,
      { month: 'short', day: 'numeric' },
    );
    const startDateArr = startDateStr.split(' ');

    const endDate = new Date(paxSegment[paxSegment.length - 1].Arrival.AircraftScheduledDateTime);

    const endDateStr = endDate.toLocaleDateString(
      contentService.locale,
      { month: 'short', day: 'numeric' },
    );
    const endDateArr = endDateStr.split(' ');

    return `${startDateArr[1]} ${startDateArr[0]} - ${endDateArr[1]} ${endDateArr[0]}`;
  }

  private getFlightTime(strTime: string): string {
    const { contentService } = this.props;
    const date = new Date(strTime);
    const [hour, minute] = date.toLocaleTimeString(contentService.locale).split(':');
    return `${hour}:${minute}`;
  }

  private getFlightFullTime(strTime: string): string {
    const { contentService } = this.props;
    const date = new Date(strTime);
    return date.toLocaleDateString(
      contentService.locale,
      { day: '2-digit', month: 'short', year: 'numeric' },
    );
  }

  private getDuration(): string {
    const { flightItem } = this.props;
    const { paxSegment } = flightItem;
    let hours = 0;
    let minutes = 0;
    paxSegment.forEach((item) => {
      const timeStr = item.Duration.substr(2, item.Duration.length);
      hours += parseInt(timeStr.substr(0, timeStr.indexOf('H')), 0);

      minutes += parseInt(
        timeStr.substr(
          timeStr.indexOf('H') + 1,
          timeStr.indexOf('M') - 1,
        ),
        0,
      );
    });

    if (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    }

    return `${hours}h ${minutes}m`;
  }

  private getFlightName = (selectedSegment: PaxSegment): string => {
    const keyValue = selectedSegment.MarketingCarrierInfo.CarrierName.toString();

    let flightName = '';
    Object.keys(FlightModels).forEach((item) => {
      if (item === keyValue) { flightName = FlightModels[item as keyof typeof FlightModels]; }
    });
    return `Etihad Airways · ${flightName}`;
  }

  private getAirportAddress(location: any): string {
    const { airports } = this.props;
    if (!airports) { return ''; }
    const selectedAirport = airports.find(
      (airport) => airport.code === location,
    )as AirportModel;

    return `${selectedAirport.cityName} ${selectedAirport.code}`;
  }

  render(): JSX.Element {
    const { flightItem, label } = this.props;
    const { paxSegment } = flightItem;

    return (
      <div className={css.PackageItem}>
        <div className={css.PackageItemHeader}>
          <img src={PlanSvg} alt="Plan" />
          <p className={css.Title}>{label}</p>
          <p className={css.Day}>{this.getHeaderDay()}</p>
        </div>
        <div className={css.PackageContent}>
          <div className={css.FlightDiv}>
            <div className={css.Airport}>
              <p className={css.Time}>
                {this.getFlightTime(paxSegment[0].Dep.AircraftScheduledDateTime)}
              </p>
              <p className={css.Description}>
                {this.getAirportAddress(paxSegment[0].Dep.IATA_LocationCode)}
              </p>
              <p className={css.Description}>
                {this.getFlightFullTime(paxSegment[0].Dep.AircraftScheduledDateTime)}
              </p>
            </div>
            <div className={css.DirectDiv}>
              <div className={css.DotFlight}>
                <div className={css.DotLine} />
                <img src={PlanBlackRightSvg} alt="flight plan" />
              </div>
              <div className={css.Duaration}>
                {this.getDuration()}
              </div>
              <div className={css.Stopport}>
                {paxSegment.length === 1 ? 'Direct' : `${paxSegment.length} Stops`}
              </div>
            </div>
            <div className={css.Airport}>
              <p className={css.Time}>
                {this.getFlightTime(
                  paxSegment[paxSegment.length - 1].Arrival.AircraftScheduledDateTime,
                )}
              </p>
              <p className={css.Description}>
                {this.getAirportAddress(
                  paxSegment[paxSegment.length - 1].Arrival.IATA_LocationCode,
                )}
              </p>
              <p className={css.Description}>
                {this.getFlightFullTime(
                  paxSegment[paxSegment.length - 1].Arrival.AircraftScheduledDateTime,
                )}
              </p>
            </div>
          </div>
          <div className={css.Airway}>
            <img src={BrandSvg} alt="Brand" />
            <div className={css.FlightNumber}>
              {paxSegment[0].MarketingCarrierInfo.CarrierDesigCode}
              {paxSegment[0].MarketingCarrierInfo.MarketingCarrierFlightNumberText}
            </div>
            <div className={css.FlightDetail}>
              {this.getFlightName(paxSegment[0])}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
