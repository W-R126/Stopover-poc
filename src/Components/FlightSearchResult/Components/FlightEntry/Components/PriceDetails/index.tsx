import React from 'react';

import css from './PriceDetails.module.css';
import earnMilesIcon from '../../../../../../Assets/Images/earn-miles.svg';
import checkedBaggageIcon from '../../../../../../Assets/Images/checked-baggage.svg';
import refundIcon from '../../../../../../Assets/Images/free-refund.svg';
import checkinIcon from '../../../../../../Assets/Images/check-in area.svg';
import upgradeIcon from '../../../../../../Assets/Images/upgrade-seat.svg';
import calendarIcon from '../../../../../../Assets/Images/calendar.svg';
import Utils from '../../../../../../Utils';
import Button from '../../../../../../Components/UI/Button';
import { FareModel } from '../../../../../../Models/FlightOfferModel';

interface PriceDetailsProps {
  fares: FareModel[];
  className?: string;
  selectedFare?: FareModel;
  onFareChange: (fare?: FareModel) => void;
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

export default class PriceDetails extends React.Component<PriceDetailsProps, {}> {
  constructor(props: PriceDetailsProps) {
    super(props);

    this.state = {};
  }

  private selectOffer(fare: FareModel): void {
    const { onFareChange, selectedFare } = this.props;

    onFareChange(selectedFare?.hashCode === fare.hashCode ? undefined : fare);
  }

  render(): JSX.Element {
    const { fares, className, selectedFare } = this.props;

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

              {fares.map((fare, idx) => (
                <TableCell selected={selectedFare?.hashCode === fare.hashCode} key={`item-${idx}`}>
                  {fare.brandLabel}
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

              {fares.map((fare, idx) => (
                <TableCell selected={selectedFare?.hashCode === fare.hashCode} key={`item-${idx}`}>
                  {`${Utils.formatCurrency(fare.milesEarned)} miles`}
                </TableCell>
              ))}
            </tr>

            <tr>
              <td>
                <img src={checkedBaggageIcon} alt="Baggage allowance" />
                Baggage allowance
              </td>

              {fares.map((fare, idx) => (
                <TableCell selected={selectedFare?.hashCode === fare.hashCode} key={`item-${idx}`}>
                  30kg
                </TableCell>
              ))}
            </tr>

            <tr>
              <td>
                <img src={refundIcon} alt="Refund fee" />
                Refund fee
              </td>

              {fares.map((fare, idx) => (
                <TableCell selected={selectedFare?.hashCode === fare.hashCode} key={`item-${idx}`}>
                  {`${fare.price.currency} ${Utils.formatCurrency(100)}`}
                </TableCell>
              ))}
            </tr>

            <tr>
              <td>
                <img src={checkinIcon} alt="Priority check-in" />
                Priority check-in
              </td>

              {fares.map((fare, idx) => (
                <TableCell selected={selectedFare?.hashCode === fare.hashCode} key={`item-${idx}`}>
                  No
                </TableCell>
              ))}
            </tr>

            <tr>
              <td>
                <img src={upgradeIcon} alt="Eligible for upgrade" />
                Eligible for upgrade
              </td>

              {fares.map((fare, idx) => (
                <TableCell selected={selectedFare?.hashCode === fare.hashCode} key={`item-${idx}`}>
                  No
                </TableCell>
              ))}
            </tr>

            <tr>
              <td>
                <img src={calendarIcon} alt="Date change free" />
                Date change fee
              </td>

              {fares.map((fare, idx) => (
                <TableCell selected={selectedFare?.hashCode === fare.hashCode} key={`item-${idx}`}>
                  {`${fare.price.currency} ${Utils.formatCurrency(100)}`}
                </TableCell>
              ))}
            </tr>

            <tr>
              <td />

              {fares.map((fare, idx) => (
                <TableCell selected={selectedFare?.hashCode === fare.hashCode} key={`item-${idx}`}>
                  <Button
                    onClick={(): void => this.selectOffer(fare)}
                  >
                    {`${fare.price.currency} ${Utils.formatCurrency(fare.price.total)}`}
                  </Button>
                </TableCell>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
