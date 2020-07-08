import React from 'react';

import commonCss from '../../../../common.module.css';
import css from './ShoppingCart.module.css';
import flightIcon from '../../../../Assets/Images/flight-white.svg';
import { OfferModel } from '../../../../Models/OfferModel';
import Utils from '../../../../Utils';
import Button from '../../../../Components/UI/Button';

interface ShoppingCartProps {
  outboundOffer?: OfferModel;
  className?: string;
  onSelectInbound: () => void;
}

export default class ShoppingCart extends React.Component<ShoppingCartProps, {}> {
  constructor(props: ShoppingCartProps) {
    super(props);

    this.state = {};
  }

  render(): JSX.Element {
    const { className, outboundOffer, onSelectInbound } = this.props;

    const classList = [css.ShoppingCart];

    if (className) {
      classList.push(className);
    }

    if (!outboundOffer) {
      classList.push(css.Collapsed);
      document.body.style.paddingBottom = '';
    } else {
      document.body.style.paddingBottom = '80px';
    }

    let outboundOfferData;

    if (outboundOffer) {
      const { segments } = outboundOffer.itineraryPart;

      outboundOfferData = {
        origin: segments[0].origin,
        destination: segments[segments.length - 1].destination,
        departure: segments[0].departure,
        arrival: segments[segments.length - 1].arrival,
        total: outboundOffer.total,
      };
    }

    const currency = outboundOfferData?.total.currency ?? '';
    const total = outboundOfferData?.total.amount ?? 0;

    return (
      <div className={classList.join(' ')}>
        <div className={`${css.ContentWrapper} ${commonCss.ContentWrapper}`}>
          <div className={css.Items}>
            {outboundOfferData && (
              <div className={css.OutboundOffer}>
                <span className={css.Time}>
                  {Utils.getHourMinuteString(
                    outboundOfferData.departure,
                    outboundOfferData.origin.timeZone,
                  )}
                </span>
                <span className={css.Airport}>{outboundOfferData.origin.code}</span>
                <img src={flightIcon} alt="Flight" className={css.FlightIcon} />
                <span className={css.Time}>
                  {Utils.getHourMinuteString(
                    outboundOfferData.arrival,
                    outboundOfferData.destination.timeZone,
                  )}
                  <span className={css.TimeZoneDelta}>
                    {Utils.getTimeZoneDelta(
                      outboundOfferData.origin.timeZone,
                      outboundOfferData.destination.timeZone,
                    )}
                  </span>
                </span>
                <span className={css.Airport}>{outboundOfferData.destination.code}</span>
              </div>
            )}
          </div>

          <div className={css.Actions}>
            <div className={css.Total}>
              <span>Total</span>
              <strong>{`${currency} ${Utils.formatCurrency(total)}`}</strong>
            </div>

            <div className={css.SelectInbound}>
              <Button onClick={onSelectInbound}>
                Select return flight
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
