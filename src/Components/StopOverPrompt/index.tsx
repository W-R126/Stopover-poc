import React from 'react';

import css from './StopOverPrompt.module.css';
import EtihadLogo from '../EtihadLogo';
import Button from '../UI/Button';
import Offer from './Components/Offer';
import { CustomerSegment } from '../../Models/StopOverModel';
import Data from './Data';

interface StopOverPromptProps {
  onAccept: (outbound?: Date, inbound?: Date, airportCode?: string, days?: number) => void;
  onReject: (airportCode?: string) => void;
}

interface StopOverPromptState {
  show: boolean;
  customerSegment?: CustomerSegment;
  outbound?: Date;
  inbound?: Date;
  days?: number[];
  airportCode?: string;
}

export default class StopOverPrompt extends React.Component<
  StopOverPromptProps,
  StopOverPromptState
> {
  constructor(props: StopOverPromptProps) {
    super(props);

    this.state = {
      show: false,
      customerSegment: undefined,
      outbound: undefined,
      inbound: undefined,
      days: undefined,
      airportCode: undefined,
    };

    this.onReject = this.onReject.bind(this);
    this.onAccept = this.onAccept.bind(this);
  }

  componentWillUnmount(): void {
    document.body.style.overflow = '';
  }

  private onReject(): void {
    const { onReject } = this.props;
    const { airportCode } = this.state;

    onReject(airportCode);
  }

  private onAccept(): void {
    const { onAccept } = this.props;
    const {
      outbound,
      inbound,
      airportCode,
      days,
    } = this.state;

    const nextDays = days ? days[0] : undefined;

    onAccept(outbound, inbound, airportCode, nextDays);
  }

  show(
    customerSegment: CustomerSegment,
    days: number[],
    airportCode: string,
    outbound: Date,
    inbound?: Date,
  ): void {
    this.setState({
      show: true,
      customerSegment,
      days,
      airportCode,
      outbound,
      inbound,
    });

    document.body.style.overflow = 'hidden';
  }

  async hide(): Promise<void> {
    await new Promise((resolve) => this.setState({ show: false }, resolve));

    document.body.style.overflow = '';
  }

  render(): JSX.Element | null {
    const { show, customerSegment } = this.state;

    if (!(show && customerSegment)) {
      return null;
    }

    const data = Data[customerSegment];

    return (
      <div className={css.StopOverPrompt}>
        <div
          className={css.Background}
          style={{
            backgroundImage: `url(${data.imageUrl})`,
            width: 1200,
            minHeight: 800,
          }}
        >
          <div className={css.Content}>
            <div className={css.LogoContainer}>
              <EtihadLogo className={css.Logo} />
            </div>

            <h1>You have a layover in Abu Dhabi!</h1>

            <p>
              Why not stay a few days and take advantage
              <br />
              of Etihad&apos;s amazing
              <strong> Stop Over Abu Dhabi </strong>
              deals?
            </p>

            <div className={css.Offers}>
              {data.offers.map((offer, idx) => (
                <Offer
                  className={css.Offer}
                  key={`offer-${idx}`}
                  imageUrl={offer.imageUrl}
                  currency={offer.currency}
                  price={offer.price}
                  title={offer.title}
                  description={offer.description}
                />
              ))}
            </div>

            <div className={css.Actions}>
              <Button className={css.Reject} type="secondary" onClick={this.onReject}>
                Maybe another time
              </Button>

              <Button className={css.Accept} onClick={this.onAccept}>
                Book Stop Over
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
