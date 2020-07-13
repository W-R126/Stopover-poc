import React from 'react';

import css from './ShoppingCart.module.css';
import commonCss from '../../common.module.css';
import Utils from '../../Utils';
import Button from '../UI/Button';

export interface ShoppingCartItemProps<T> {
  className?: string;
  currency: string;
  price: number;
  item: T;
}

interface ShoppingCartProps {
  className?: string;
  currency: string;
  children: React.ReactNode;
  proceedLabel?: string;
  proceedAction?: () => void;
}

export default function ShoppingCart({
  className,
  currency,
  children,
  proceedLabel,
  proceedAction,
}: ShoppingCartProps): JSX.Element {
  const classList = [css.ShoppingCart];

  if (className) {
    classList.push(className);
  }

  const items = (React.Children.toArray(children) as JSX.Element[]);
  const total = items.reduce((prev, curr) => prev + curr.props.price, 0);

  return (
    <>
      <style>
        {`body { transition: padding-bottom 200ms;${
          items.length > 0 ? ' padding-bottom: 90px;' : ''
        } }`}
      </style>

      <div className={classList.join(' ')} aria-expanded={items.length > 0}>
        <div className={`${css.ContentWrapper} ${commonCss.ContentWrapper}`}>
          <div className={css.Items}>
            {items}
          </div>

          <div className={css.Details}>
            <span className={css.Total}>
              <span>Total</span>
              <strong>{`${currency} ${Utils.formatCurrency(total)}`}</strong>
            </span>

            {proceedLabel && proceedAction && (
              <Button type="primary" onClick={proceedAction}>
                {proceedLabel}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
