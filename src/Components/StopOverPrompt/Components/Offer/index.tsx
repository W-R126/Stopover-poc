import React from 'react';

import css from './Offer.module.css';

interface OfferProps {
  className?: string;
  imageUrl: string;
  title: string;
  description: string;
  price: number;
  currency: string;
}

export default function Offer({
  className,
  imageUrl,
  title,
  description,
  price,
  currency,
}: OfferProps): JSX.Element {
  const classList = [css.Offer];

  if (className) {
    classList.push(className);
  }

  return (
    <div className={classList.join(' ')}>
      <div className={css.Image} style={{ backgroundImage: `url(${imageUrl})` }} />
      <h1>{title}</h1>
      <p>{description}</p>
      <strong>{`${currency} ${price}`}</strong>
    </div>
  );
}
