import React from 'react';
import commonCss from '../../../../common.module.css';
import css from './PackagePrompt.module.css';
import CloseSvg from '../../../../Assets/Images/NDC/close-black.svg';
import CloseWhiteSvg from '../../../../Assets/Images/NDC/close-btn-white.svg';
import PlanSvg from '../../../../Assets/Images/NDC/plan-white.svg';
import BedSvg from '../../../../Assets/Images/NDC/bed-white.svg';
import FlagStarSvg from '../../../../Assets/Images/NDC/flag-star-white.svg';

import ContentService from '../../Services/ContentService';
import Loading from './Components/Loading';
import FlightItem from './Components/FlightItem';
import HotelItem from './Components/HotelItem';
import ExperienceItem from './Components/ExperienceItem';

import { TripModel } from '../../Models/TripModel';
import {
  Ns1Hotel, PassengerModel, FlightItemModel, Ns1Experience, TotalOfferPrice, Pax,
} from '../../Models/NDCModel';
import { AirportModel } from '../../../../Models/AirportModel';

interface PackagePromptProps {
  viewStatus: number;
  closePrompt: Function;
  trip: TripModel;
  outbound?: FlightItemModel;
  inbound?: FlightItemModel;
  hotel?: Ns1Hotel;
  experience?: Ns1Experience;
  paxList?: PassengerModel;
  contentService: ContentService;
  airports?: AirportModel[];
  totalPrice?: TotalOfferPrice;
}

export default function PackagePrompt({
  viewStatus,
  closePrompt,
  inbound,
  outbound,
  hotel,
  experience,
  paxList,
  contentService,
  airports,
  totalPrice,
}: PackagePromptProps): JSX.Element {
  const getTotalPrice = (isHightest: boolean): string => {
    if (!totalPrice) { return ''; }

    let flightPrice = 0;
    if (isHightest) {
      flightPrice = totalPrice.HighestOfferPrice;
    } else flightPrice = totalPrice.LowestOfferPrice;

    if (paxList) {
      const passengeCount = {
        ADULT: paxList.Pax.filter((item: Pax) => item.PTC === 'ADT').length,
        CHILD: paxList.Pax.filter((item: Pax) => item.PTC === 'CHD').length,
        INFANT: paxList.Pax.filter((item: Pax) => item.PTC === 'INF').length,
      };

      // get Hotel Price
      if (hotel) {
        const rateInfo = hotel['ns1:Room']['ns1:RatePlans']['ns1:RatePlan']['ns1:RateInfo'];
        flightPrice += (passengeCount.ADULT + passengeCount.CHILD) * parseFloat(rateInfo['ns1:NetRate']);
      }

      // get Experience Price
      if (experience) {
        const passengerType = ['ADULT', 'CHILD', 'INFANT'];
        passengerType.forEach((item: string): void => {
          const SeasonDetails = experience['ns1:Product']['ns1:ProductTypeSeasons']['ns1:ProductTypeSeasonDetails'];
          const findSeason = SeasonDetails.find((itemOne) => itemOne['ns1:ProductType'] === item);
          if (findSeason) {
            const ProductTypePricing = findSeason['ns1:ProductTypePricing'];
            const SalePrice = parseFloat(ProductTypePricing['ns1:ProductTypeSalesPrice']);
            const DiscountPrice = parseFloat(ProductTypePricing['ns1:ProductTypeDiscount']);
            const productPrice = SalePrice - DiscountPrice;
            flightPrice += productPrice * passengeCount[item as keyof typeof passengeCount];
          }
        });
      }
    }

    return `${totalPrice?.CurCode} ${Number(flightPrice).toFixed(2)}`;
  };

  return (
    <div className={css.PackagePrompt}>
      <div className={`${css.PackageModal} ${commonCss.ContentWrapper}`}>
        {viewStatus === 0 && <Loading />}

        {viewStatus === 200 && (
          <>
            <div className={css.HeaderSection}>
              <div
                className={css.CloseButton}
                onClick={(): void => { closePrompt(); }}
                role="button"
              >
                <img src={CloseSvg} alt="close prompt" />
              </div>
              <h5 className={css.Title}><strong>Vacations.com</strong></h5>
              <p className={css.SubTitle}>
                We've created this package for you!
              </p>
            </div>
            <div className={css.PackageContainer}>
              {outbound && (
                <FlightItem
                  flightItem={outbound}
                  label="Depature Flight"
                  contentService={contentService}
                  airports={airports}
                />
              )}
              {
                (hotel && paxList) && (
                  <HotelItem
                    hotel={hotel}
                    paxList={paxList}
                    contentService={contentService}
                  />
                )
              }
              {(experience && outbound) && (
                <ExperienceItem
                  experience={experience}
                  contentService={contentService}
                  paxList={paxList}
                  flightItem={outbound}
                />
              )}
              {inbound && (
                <FlightItem
                  flightItem={inbound}
                  label="Onward Flight"
                  contentService={contentService}
                  airports={airports}
                />
              )}

            </div>

            <div className={css.FooterSection}>
              <div className={css.Contents}>
                <div>
                  <img src={PlanSvg} alt="plan" />
                  {
                hotel && (
                <>
                  +
                  <img src={BedSvg} alt="bed" />
                </>
                )
              }
                  {
                experience && (
                  <>
                    +
                    <img src={FlagStarSvg} alt="flag star" />
                  </>
                )
              }
                </div>
                <p>Full itinerary shown above included in offer. T&C apply</p>
              </div>
              <div className={css.PriceContents}>
                <div>
                  <p className={css.OriginPrice}>
                    {getTotalPrice(true)}
                  </p>
                  <p className={css.CurPrice}>
                    {getTotalPrice(false)}
                  </p>
                  <p className={css.Taxes}>Tax & Fees Included</p>
                </div>
                <button className={css.GoButton} type="button">Let's Go</button>
              </div>
            </div>
          </>
        )}

        {(viewStatus === 204 || viewStatus === 500) && (
        <div className={css.ErrorScreen}>
          <div className={css.ErrorHeader}>
            Creating your package failed!
            <div
              className={css.CloseButton}
              onClick={(): void => { closePrompt(); }}
              role="button"
            >
              <img src={CloseWhiteSvg} alt="close prompt" />
            </div>

          </div>
          <div className={css.NoFlight}>
            <div className={css.Overlay}>
              {viewStatus === 204 && 'No flight has been found for your request.'}
              {viewStatus === 500 && 'Oops. Something went wrong.'}
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
}
