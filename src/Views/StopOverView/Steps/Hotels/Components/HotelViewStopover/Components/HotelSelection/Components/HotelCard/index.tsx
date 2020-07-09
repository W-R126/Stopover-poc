import React from 'react';
import css from './HotelCard.module.css';
import {
  HotelAvailInfo, ImageItem,
} from '../../../../../../../../../../Services/Responses/ConfirmStopOverResponse';
import { getNetRateOfHotelAvailInfo } from '../../../../../../Utils';
import ReviewStar from '../ReviewStar';
import RoomSelect from '../RoomSelect';

interface HotelCardProps extends HotelAvailInfo {
  selectHotel: Function;
  selectedNight: number;
  selectedHotelCode: string;
}

interface HotelCardStat {
  showRoomList: boolean;
}

export class HotelCard extends React.Component<HotelCardProps, HotelCardStat> {
  constructor(props: HotelCardProps) {
    super(props);
    this.state = {
      showRoomList: false,
    };
  }

  getImageURL = (imageItem: ImageItem[]): string => {
    if (imageItem.length > 0) {
      return `http://photos.hotelbeds.com/giata/${imageItem[0]?.image?.url}`;
    }
    return '';
  };

  changeRoom = (): void => {
    this.setState((previousState) => ({
      showRoomList: !previousState.showRoomList,
    }));
  };

  render(): JSX.Element {
    const {
      hotelImageInfo,
      hotelInfo,
      hotelRateInfo,
      selectHotel,
      selectedNight,
      selectedHotelCode,
    } = this.props;

    const { showRoomList } = this.state;

    return (
      <div
        className={`
          ${css.HotelCard} 
          ${selectedHotelCode === hotelInfo.hotelCode ? css.Selected : ''}
          ${showRoomList ? css.ShowRoomList : ''}`}
      >
        <div
          className={css.MainInfo}
        >
          <div className={css.CardImageWrap}>
            <img
              src={this.getImageURL(hotelImageInfo.imageItems)}
              alt=""
            />
            {hotelInfo?.recommended ? (
              <div className={css.RecommendedWrap}>Recommended</div>
            ) : null}
          </div>
          <div className={css.CardRight}>
            <div className={css.MainContent}>
              <div className={css.CardInnerLeft}>
                <div className={css.NameFlex}>
                  <h3 className={css.Name}>
                    {hotelInfo?.hotelName}
                  </h3>
                  <ReviewStar reviews={hotelInfo.reviews} />
                </div>
                <p className={css.HotelStar}>{`${hotelInfo?.rating} star hotel`}</p>
                <p className={css.Country}>
                  {`${hotelInfo?.locationInfo?.address?.addressLine1}, ${hotelInfo?.locationInfo?.address?.cityName?.value}`}
                </p>
                <p className={css.PremierText}>Pearl Double Room with Partial Sea View</p>
                <p className={css.CheckIn}>Check-in: 10:00pm</p>
              </div>
              <div className={css.CardInnerRight}>
                <div>
                  <p className={css.NightsText}>
                    {`${selectedNight} Nights 1 Adult`}
                  </p>
                  <h4 className={css.Price}>
                    {`${hotelInfo?.currencyCode} ${getNetRateOfHotelAvailInfo({
                      hotelImageInfo,
                      hotelInfo,
                      hotelRateInfo,
                    })}`}
                  </h4>
                </div>
              </div>
            </div>
            <div className={css.BottomBtnContent}>
              <button
                className={css.ChangeRoomBtn}
                onClick={this.changeRoom}
                type="button"
              >
                Change Room
              </button>
              <button
                className={
                  `${css.SelectHotelBtn} ${selectedHotelCode === hotelInfo.hotelCode ? css.Selected : ''}`
                }
                onClick={(): void => { selectHotel(hotelInfo.hotelCode); }}
                type="button"
              >
                {selectedHotelCode === hotelInfo.hotelCode ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        </div>
        <RoomSelect hotelRateInfo={hotelRateInfo} />
      </div>
    );
  }
}
