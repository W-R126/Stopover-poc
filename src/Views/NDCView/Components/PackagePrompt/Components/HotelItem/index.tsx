import React from 'react';
import css from './HotelItem.module.css';
import BedSvg from '../../../../../../Assets/Images/NDC/bed-white.svg';
import ContentService from '../../../../Services/ContentService';
import DateUtils from '../../../../../../DateUtils';

import ReviewStar from './Components/ReviewStar';

import {
  PassengerModel,
  Pax,
  Ns1Amenity,
} from '../../../../Models/NDCModel';

interface HotelItemProps {
  hotel: any;
  paxList: PassengerModel;
  contentService: ContentService;
}

export default class HotelItem extends React.Component<HotelItemProps, {}> {
  private getHotelDuration(): string {
    const { hotel, contentService } = this.props;
    const startDate = new Date(hotel['ns1:Checkin']);
    const startDateStr = startDate.toLocaleDateString(
      contentService.locale,
      { month: 'short', day: 'numeric' },
    );

    const endDate = new Date(hotel['ns1:Checkout']);
    const endDateStr = endDate.toLocaleDateString(
      contentService.locale,
      { month: 'short', day: 'numeric' },
    );

    const startDateArr = startDateStr.split(' ');
    const endDateArr = endDateStr.split(' ');

    return `${startDateArr[1]} ${startDateArr[0]} - ${endDateArr[1]} ${endDateArr[0]}`;
  }

  private getHotelImage(): string {
    const { hotel } = this.props;
    const baseUrl = hotel['ns1:ImageBaseUrl'];
    const NS1Image = hotel['ns1:Images']['ns1:Image'][0]['ns1:Image'];
    const imageUrl = NS1Image['ns1:Url'];
    return baseUrl + imageUrl;
  }

  private getAddress(): string {
    const { hotel } = this.props;
    const address = hotel['ns1:Info']['ns1:LocationInfo']['ns1:Address'];
    const addressLine = address['ns1:AddressLine1'];
    const cityName = address['ns1:CityName']['ns1:Value'];
    return `${addressLine}, ${cityName}`;
  }

  private getPaxInfo(): string {
    const { paxList, hotel } = this.props;

    const dayNight = DateUtils.getDaysDelta(
      new Date(hotel['ns1:Checkout']),
      new Date(hotel['ns1:Checkin']),
    );

    let strReturn = '';
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
    return `${dayNight} Nights,  ${strReturn}`;
  }

  private renderCheckInOut(): JSX.Element {
    const { hotel } = this.props;
    let checkInHour = '';
    const Amentities = hotel['ns1:Info']['ns1:Amenities']['ns1:Amenity'];
    const filterCheckIn = Amentities.filter((item: Ns1Amenity) => item['ns1:Description'] === 'Check-in hour');
    if (filterCheckIn.length > 0 && filterCheckIn[0]['ns1:Value']) {
      const valueArr = filterCheckIn[0]['ns1:Value'].split(':');
      const hourValue = parseInt(valueArr[0], 0);
      if (hourValue <= 12) {
        checkInHour = `Check-in: ${(`0${hourValue}`).slice(-2)}:${valueArr[1]} am`;
      } else {
        checkInHour = `Check-in: ${(`0${hourValue - 12}`).slice(-2)}:${valueArr[1]} pm`;
      }
    } else checkInHour = 'Not specified';

    let checkOutHour = '';
    const filterCheckOut = Amentities.filter((item: Ns1Amenity) => item['ns1:Description'] === 'Check-out hour');
    if (filterCheckOut.length > 0 && filterCheckOut[0]['ns1:Value']) {
      const valueArr = filterCheckOut[0]['ns1:Value'].split(':');
      const hourValue = parseInt(valueArr[0], 0);
      if (hourValue <= 12) {
        checkOutHour = `Check-out: ${(`0${hourValue}`).slice(-2)}:${valueArr[1]} am`;
      } else {
        checkOutHour = `Check-out: ${(`0${hourValue - 12}`).slice(-2)}:${valueArr[1]} pm`;
      }
    } else checkOutHour = 'Not specified';

    return (
      <div className={css.DayNight}>
        {checkInHour}
        <br />
        {checkOutHour}
      </div>
    );
  }

  render(): JSX.Element {
    const { hotel } = this.props;
    return (
      <div className={css.PackageItem}>
        <div className={`${css.PackageItemHeader} ${css.Hotel}`}>
          <img src={BedSvg} alt="Plan" />
          <p className={css.Title}>Hotel</p>
          <p className={css.Day}>{this.getHotelDuration()}</p>
        </div>
        <div className={css.PackageContent}>
          <ReviewStar
            reviews={hotel['ns1:Info']['ns1:Reviews']}
          />
          <img className={css.HotelImage} src={this.getHotelImage()} alt="hotel" />
          <div className={css.HotelImageOverlay} />
          <div className={css.HotelName}>{hotel['ns1:Info']['ns1:HotelName']}</div>
          <div className={css.HotelLocation}>
            {this.getAddress()}
          </div>
          <div className={css.DayNight}>
            {this.getPaxInfo()}
          </div>
          <div className={css.DayNight}>
            {hotel['ns1:Room']['ns1:RoomDescription']['ns1:Name']}
          </div>
          {this.renderCheckInOut()}
        </div>
      </div>
    );
  }
}
