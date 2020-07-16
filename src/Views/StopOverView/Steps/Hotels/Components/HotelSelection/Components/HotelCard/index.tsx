import React from 'react';
import css from './HotelCard.module.css';
import {
  HotelAvailInfo, ImageItem,
} from '../../../../../../../../Services/Responses/ConfirmStopOverResponse';
import { getCheapestRoomRateKey, getCheapestRoomRatePlan } from '../../../../Utils';
import ReviewStar from '../ReviewStar';
import RoomSelect from '../RoomSelect';
import HotelDetailModal from '../HotelDetailModal';

interface HotelCardProps extends HotelAvailInfo {
  selectHotel: Function;
  selectedNight?: number;
  selectedHotelCode?: string;
}

interface HotelCardStat {
  showRoomList: boolean;
  showDetailModal: boolean;
}

export class HotelCard extends React.Component<HotelCardProps, HotelCardStat> {
  constructor(props: HotelCardProps) {
    super(props);

    this.state = {
      showRoomList: false,
      showDetailModal: false,
    };
  }

  private getImageURL = (imageItem: ImageItem[]): string => {
    if (imageItem.length > 0) {
      return `http://photos.hotelbeds.com/giata/${imageItem[0]?.image?.url}`;
    }
    return '';
  };

  private getPriceStr(): string {
    const { hotelRateInfo } = this.props;
    const rateInfo = getCheapestRoomRatePlan(hotelRateInfo);
    if (rateInfo) return `${rateInfo.rateInfo.currencyCode} ${rateInfo.rateInfo.netRate}`;
    return '';
  }

  private changeRoom = (): void => {
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

    const { showRoomList, showDetailModal } = this.state;

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
                    {this.getPriceStr()}
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
                onClick={(): void => {
                  selectHotel(hotelInfo.hotelCode, getCheapestRoomRateKey(hotelRateInfo));
                }}
                type="button"
              >
                {selectedHotelCode === hotelInfo.hotelCode ? 'Selected' : 'Select'}
              </button>
            </div>
          </div>
        </div>
        <RoomSelect
          hotelRateInfo={hotelRateInfo}
          showDetailModal={(): void => {
            this.setState({ showDetailModal: true });
          }}
        />
        {showDetailModal
        && (
        <HotelDetailModal
          hotelAvailInfo={{
            hotelImageInfo,
            hotelInfo,
            hotelRateInfo,
          }}
          hideModal={(): void => this.setState({
            showDetailModal: false,
          })}
        />
        )}
      </div>
    );
  }
}
