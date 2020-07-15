import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import GoogleMapReact from 'google-map-react';
import css from './HotelDetailModal.module.css';
import closeIcon from '../../../../../../../../Assets/Images/close-btn-white.svg';
import pricingIcon from '../../../../../../../../Assets/Images/pricing.svg';
import checkInIcon from '../../../../../../../../Assets/Images/access_time-24px.svg';
import SpaIcon from '../../../../../../../../Assets/Images/spa.svg';
import GolfIcon from '../../../../../../../../Assets/Images/golf.svg';
import InfoStationIcon from '../../../../../../../../Assets/Images/info-station.svg';
import { HotelAvailInfo } from '../../../../../../../../Services/Responses/ConfirmStopOverResponse';
import Marker from './Components/Marker';

interface HotelDetailModalProps {
  hideModal: Function;
  hotelAvailInfo: HotelAvailInfo;
}

interface HotelDetailModalState {
  tab: number;
}

export default class HotelDetailModal extends React.Component<
HotelDetailModalProps,
HotelDetailModalState
> {
  private readonly TABS = ['Summary', 'Location', 'Amentities']

  constructor(props: HotelDetailModalProps) {
    super(props);
    this.state = {
      tab: 0,
    };
  }

  private getImageURL = (imageUrl?: string): string => {
    if (imageUrl && imageUrl.length > 0) {
      return `http://photos.hotelbeds.com/giata/bigger/${imageUrl}`;
    }
    return '';
  };

  renderImageCarousle(): JSX.Element {
    const { hotelAvailInfo } = this.props;
    const { hotelImageInfo } = hotelAvailInfo;
    const divs: JSX.Element[] = [];
    hotelImageInfo.imageItems.forEach((item, idx) => {
      if (item.image && item.image.url) {
        divs.push(
          <div key={idx} className={css.SliderItemDiv}>
            <img src={this.getImageURL(item.image.url)} alt={`room ${idx}`} />
          </div>,
        );
      }
    });
    return (
      <Carousel showArrows={false} showStatus={false}>
        {divs}
      </Carousel>
    );
  }

  render(): JSX.Element {
    const { tab } = this.state;
    const { hideModal, hotelAvailInfo } = this.props;
    const {
      hotelInfo,
    } = hotelAvailInfo;

    return (
      <div className={css.ModalContainer}>
        <div className={css.Modal}>
          <div className={css.ModalContent}>
            <div className={css.ModalHeader}>
              <h3 className={css.ModalTitle}>{hotelInfo?.hotelName}</h3>
              <button
                className={css.CloseButton}
                type="button"
                onClick={() => {
                  hideModal();
                }}
              >
                <img src={closeIcon} alt="Modal Close" />
              </button>
            </div>
            <div className={css.ModalBody}>
              <div className={css.HotelImageContainer}>
                {this.renderImageCarousle()}
              </div>
              <div className={css.HotelContent}>
                <div className={css.TabContainer}>
                  <div className={css.TabHeader}>
                    <ul>
                      {this.TABS.map((item, idx) => (
                        <li
                          className={`${idx === tab ? css.Active : ''}`}
                          onClick={() => { this.setState({ tab: idx }); }}
                          role="button"
                        >
                          <div className={css.Tab}>{item}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={css.TabContent}>
                    {tab === 0
                    && (
                    <div className={css.SummaryContent}>
                      <div className={css.SummaryHeader}>
                        <div className={css.Item}>
                          <p>
                            <img className={css.PricingIcon} src={pricingIcon} alt="Pricing Icon" />
                            Pricing
                          </p>
                          <p>
                            From AED 1,150
                          </p>
                        </div>
                        <div className={css.Item}>
                          <p>
                            <img className={css.CheckInIcon} src={checkInIcon} alt="CheckIn Icon" />
                            Check-in
                          </p>
                          <p>10:00am</p>
                        </div>
                      </div>
                      <div className={css.Description}>
                        {hotelAvailInfo.hotelRateInfo.rooms.room[0].roomDescription}
                      </div>
                    </div>
                    )}
                    {tab === 1 && (
                    <div className={css.LocationContent}>
                      <GoogleMapReact
                        bootstrapURLKeys={{
                          key: 'AIzaSyBawYr07rE9yVadLtXeWC2pNeGFlOrbFXA',
                        }}
                        defaultCenter={{
                          lat: parseFloat(hotelInfo.locationInfo.latitude),
                          lng: parseFloat(hotelInfo.locationInfo.longitude),
                        }}
                        defaultZoom={14}
                      >
                        <Marker
                          lat={parseFloat(hotelInfo.locationInfo.latitude)}
                          lng={parseFloat(hotelInfo.locationInfo.longitude)}
                        />
                      </GoogleMapReact>
                    </div>
                    )}
                    {
                      tab === 2 && (
                        <div className={css.AmentityContiner}>
                          <div className={css.AmentityCol}>
                            <div className={css.AmentityColHeader}>
                              <img src={InfoStationIcon} alt="information" />
                              General
                            </div>
                            <ul>
                              <li>
                                <span>•</span>
                                Convenience store (on site)
                              </li>
                              <li>
                                <span>•</span>
                                Air conditioning
                              </li>
                              <li>
                                <span>•</span>
                                Shops (on site)
                              </li>
                              <li>
                                <span>•</span>
                                Car rental
                              </li>
                              <li>
                                <span>•</span>
                                Packed lunches
                              </li>
                              <li>
                                <span>•</span>
                                Restaurants
                              </li>
                              <li>
                                <span>•</span>
                                Gift shop
                              </li>
                              <li>
                                <span>•</span>
                                Hair/Beauty salon
                              </li>
                              <li>
                                <span>•</span>
                                Facilities for disabled guests
                              </li>
                              <li>
                                <span>•</span>
                                Non-smoking rooms
                              </li>
                              <li>
                                <span>•</span>
                                Room service
                              </li>
                            </ul>
                          </div>
                          <div className={css.AmentityCol}>
                            <div className={css.AmentityColHeader}>
                              <img src={GolfIcon} alt="activities" />
                              Activities
                            </div>
                            <ul>
                              <li>
                                <span>•</span>
                                Beach
                              </li>
                              <li>
                                <span>•</span>
                                Water park
                              </li>
                              <li>
                                <span>•</span>
                                Kid's Club
                              </li>
                              <li>
                                <span>•</span>
                                Cycling
                              </li>
                              <li>
                                <span>•</span>
                                Windsurfing Additional charge
                              </li>
                              <li>
                                <span>•</span>
                                Ping-poing
                              </li>
                              <li>
                                <span>•</span>
                                Pool table
                              </li>
                              <li>
                                <span>•</span>
                                Playground
                              </li>
                              <li>
                                <span>•</span>
                                Tenis court
                              </li>
                            </ul>
                          </div>
                          <div className={css.AmentityCol}>
                            <div className={css.AmentityColHeader}>
                              <img src={SpaIcon} alt="span" />
                              Spa
                            </div>
                            <ul>
                              <li>
                                <span>•</span>
                                Swimming pool
                              </li>
                              <li>
                                <span>•</span>
                                Fitness
                              </li>
                              <li>
                                <span>•</span>
                                Spa facilities
                              </li>
                              <li>
                                <span>•</span>
                                Waterslide
                              </li>
                              <li>
                                <span>•</span>
                                Steam Bath Additional charge
                              </li>
                              <li>
                                <span>•</span>
                                Hot tub/Jacuzzi
                              </li>
                              <li>
                                <span>•</span>
                                Massage Additional charge
                              </li>
                              <li>
                                <span>•</span>
                                Spa Additional charge
                              </li>
                              <li>
                                <span>•</span>
                                Facilities for disabled guests
                              </li>
                              <li>
                                <span>•</span>
                                Fitness center
                              </li>
                            </ul>
                          </div>
                        </div>
                      )
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
