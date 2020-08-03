import React from 'react';
import css from './ExperienceItem.module.css';
import FlagStarSvg from '../../../../../../Assets/Images/NDC/flag-star-white.svg';
import ContentService from '../../../../Services/ContentService';
import {
  Ns1Experience, PaxList, Pax, FlightItemModel,
} from '../../../../Models/NDCModel';

interface ExperienceItemProps {
  contentService: ContentService;
  experience: Ns1Experience;
  paxList: PaxList|undefined;
  flightItem: FlightItemModel;
}

export default class ExperienceItem extends React.Component<ExperienceItemProps, {}> {
  private getDuration(): string {
    const { experience, contentService, flightItem } = this.props;
    const availabilities = experience['ns1:Availabilities'] ?? undefined;
    if (availabilities) {
      const dateStr = availabilities['ns1:Items'][0]['ns1:AvailabilityFromDateTime'];

      const experinceDate = new Date(dateStr);

      const experienceDateStr = experinceDate.toLocaleDateString(
        contentService.locale,
        { month: 'short', day: 'numeric' },
      );
      const dateArr = experienceDateStr.split(' ');
      return `${dateArr[1]} ${dateArr[0]}`;
    }
    const { paxSegment } = flightItem;
    const endDate = new Date(paxSegment[paxSegment.length - 1].Dep.AircraftScheduledDateTime);
    const expDate = new Date(endDate.valueOf() + 24 * 60 * 60 * 1000);

    const expDateStr = expDate.toLocaleDateString(
      contentService.locale,
      { month: 'short', day: 'numeric' },
    );
    const expDateArr = expDateStr.split(' ');
    return `${expDateArr[1]} ${expDateArr[0]}`;
  }

  private getTitle(): string {
    const { experience } = this.props;
    const productContent = experience['ns1:Product']['ns1:ProductContent'];
    return `${productContent['ns1:ProductTitle']}, ${productContent['ns1:ProductSupplierName']}`;
  }

  private getLocation(): string {
    const { experience } = this.props;
    const productLocations = experience['ns1:Product']['ns1:ProductLocations'];
    return productLocations['ns1:LocationDescription'];
  }

  private getShotDescription(): string {
    const { experience } = this.props;
    const productContent = experience['ns1:Product']['ns1:ProductContent'];
    return productContent['ns1:ProductShortDescription'];
  }

  private getTicket(): string |undefined {
    const { paxList } = this.props;
    if (!paxList) { return ''; }
    let strReturn = '';
    if (Array.isArray(paxList.Pax)) {
      const filterADT = paxList.Pax.filter((item: Pax) => item.PTC === 'ADT');
      strReturn += `${filterADT.length} Adult`;
      strReturn += filterADT.length > 1 ? 's' : '';

      const filterChild = paxList.Pax.filter((item: Pax) => item.PTC === 'CHD');
      if (filterChild.length > 0) {
        strReturn += ` ${filterChild.length} Child`;
        strReturn += filterChild.length > 1 ? 's' : '';
      }

      const filterInf = paxList.Pax.filter((item: Pax) => item.PTC === 'INF');
      if (filterInf.length > 0) {
        strReturn += ` ${filterInf.length} Infant`;
        strReturn += filterInf.length > 1 ? 's' : '';
      }
      return `${strReturn} tickets`;
    }
    return '1 Adult ticket';
  }

  private renderProductImg(): JSX.Element|null {
    const { experience } = this.props;
    let ImageUrl = '';
    const productContent = experience['ns1:Product']['ns1:ProductContent'] ?? undefined;
    if (productContent) {
      const ns1ProductImages = productContent['ns1:ProductImages'] ?? undefined;
      if (ns1ProductImages) {
        if (Array.isArray(ns1ProductImages)) {
          ImageUrl = ns1ProductImages[0]['ns1:ImageUrl'] ?? '';
        } else {
          ImageUrl = ns1ProductImages['ns1:ImageUrl'] ?? '';
        }
      }
    }

    if (ImageUrl.length === 0) return null;
    return <img className={css.HotelImage} src={ImageUrl} alt="hotel" />;
  }

  render(): JSX.Element {
    return (
      <div className={css.PackageItem}>
        <div className={`${css.PackageItemHeader} ${css.Experience}`}>
          <img src={FlagStarSvg} alt="Plan" />
          <p className={css.Title}>Experiences</p>
          <p className={css.Day}>{this.getDuration()}</p>
        </div>
        <div className={`${css.PackageContent} ${css.Experience}`}>
          <div className={css.ExperienceItem}>
            {this.renderProductImg()}
            <div className={css.HotelImageOverlay} />
            <div className={css.Title}>{this.getTitle()}</div>
            <div className={css.Location}>
              {this.getLocation()}
            </div>
            <div className={css.Description}>
              {this.getShotDescription()}
            </div>
            <div className={css.Passenger}>{this.getTicket()}</div>
          </div>
        </div>
      </div>
    );
  }
}
