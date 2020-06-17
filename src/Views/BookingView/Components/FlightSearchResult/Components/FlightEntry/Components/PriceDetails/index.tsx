import React from 'react';

import css from './PriceDetails.module.css';
import earnMilesIcon from '../../../../../../../../Assets/Images/earn-miles.svg';
import checkedBaggageIcon from '../../../../../../../../Assets/Images/checked-baggage.svg';
import refundIcon from '../../../../../../../../Assets/Images/free-refund.svg';
import checkinIcon from '../../../../../../../../Assets/Images/check-in area.svg';
import upgradeIcon from '../../../../../../../../Assets/Images/upgrade-seat.svg';
import calendarIcon from '../../../../../../../../Assets/Images/calendar.svg';
import { OfferModel } from '../../../../../../../../Models/OfferModel';
import Utils from '../../../../../../../../Utils';

interface PriceDetailsProps {
  cabinClass: {
    offers: OfferModel[];
    startingFrom: {
      amount: number;
      currency: string;
    };
  };
  className?: string;
}

interface PriceDetailsState {
  selectedOffer?: OfferModel;
}

function TableCell({ children, selected }: {
  children: React.ReactNode;
  selected: boolean;
}): JSX.Element {
  const classList = [css.Data];

  if (selected) {
    classList.push(css.Selected);
  }

  return (
    <td className={selected ? css.Selected : undefined}>
      {children}
    </td>
  );
}

export default class PriceDetails extends React.Component<PriceDetailsProps, PriceDetailsState> {
  constructor(props: PriceDetailsProps) {
    super(props);

    this.state = {
      selectedOffer: undefined,
    };
  }

  private selectOffer(selectedOffer: OfferModel): void {
    this.setState({ selectedOffer });
  }

  render(): JSX.Element {
    const { cabinClass: { offers }, className } = this.props;
    const { selectedOffer } = this.state;

    const classList = [css.PriceDetails];

    if (className) {
      classList.push(className);
    }

    return (
      <div className={classList.join(' ')}>
        <table>
          <thead>
            <tr>
              <td />
              {offers.map((offer, idx) => (
                <TableCell selected={selectedOffer === offer} key={`item-${idx}`}>
                  {offer.brandLabel}
                </TableCell>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img src={earnMilesIcon} alt="Earn miles" />
                Miles earned
              </td>
              {offers.map((offer, idx) => (
                <TableCell selected={selectedOffer === offer} key={`item-${idx}`}>
                  {`${Utils.formatCurrency(800)} miles`}
                </TableCell>
              ))}
            </tr>

            <tr>
              <td>
                <img src={checkedBaggageIcon} alt="Baggage allowance" />
                Baggage allowance
              </td>
              {offers.map((offer, idx) => (
                <TableCell selected={selectedOffer === offer} key={`item-${idx}`}>
                  30kg
                </TableCell>
              ))}
            </tr>

            <tr>
              <td>
                <img src={refundIcon} alt="Refund fee" />
                Refund fee
              </td>
              {offers.map((offer, idx) => (
                <TableCell selected={selectedOffer === offer} key={`item-${idx}`}>
                  {`${offer.total.currency} ${Utils.formatCurrency(100)}`}
                </TableCell>
              ))}
            </tr>

            <tr>
              <td>
                <img src={checkinIcon} alt="Priority check-in" />
                Priority check-in
              </td>
              {offers.map((offer, idx) => (
                <TableCell selected={selectedOffer === offer} key={`item-${idx}`}>
                  No
                </TableCell>
              ))}
            </tr>

            <tr>
              <td>
                <img src={upgradeIcon} alt="Upgrade eligible" />
                Upgrade eligible
              </td>
              {offers.map((offer, idx) => (
                <TableCell selected={selectedOffer === offer} key={`item-${idx}`}>
                  No
                </TableCell>
              ))}
            </tr>

            <tr>
              <td>
                <img src={calendarIcon} alt="Date change free" />
                Date change fee
              </td>
              {offers.map((offer, idx) => (
                <TableCell selected={selectedOffer === offer} key={`item-${idx}`}>
                  {`${offer.total.currency} ${Utils.formatCurrency(100)}`}
                </TableCell>
              ))}
            </tr>

            <tr>
              <td />
              {offers.map((offer, idx) => (
                <TableCell selected={selectedOffer === offer} key={`item-${idx}`}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={(): void => this.selectOffer(offer)}
                  >
                    {`${offer.total.currency} ${Utils.formatCurrency(offer.total.amount)}`}
                  </button>
                </TableCell>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
