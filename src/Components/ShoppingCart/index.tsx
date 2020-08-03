import React, { useState, useRef } from 'react';

import css from './ShoppingCart.module.css';
import commonCss from '../../common.module.css';
import Utils from '../../Utils';
import Button from '../UI/Button';
import Collapsable from '../UI/Collapsable';

export interface ShoppingCartItemProps<T> {
  className?: string;
  currency: string;
  price: number;
  item: T;
  detailed?: boolean;
  style?: React.CSSProperties;
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
  const [showDetails, setShowDetails] = useState(false);
  const itemsRef = useRef<HTMLDivElement>(null);

  const items = (React.Children.toArray(children) as JSX.Element[]);
  const total = items.reduce((prev, curr) => prev + curr.props.price, 0);

  const classList = [css.ShoppingCart, className, showDetails ? css.ShowDetails : undefined];

  return (
    <>
      <style>
        {`body { transition: padding-bottom 200ms;${
          items.length > 0 ? ' padding-bottom: 90px;' : ''
        } }`}
      </style>

      <div className={classList.join(' ')} aria-expanded={items.length > 0}>
        <div className={`${css.ContentWrapper} ${commonCss.ContentWrapper}`}>
          <div className={css.Items} ref={itemsRef}>
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

            <button
              type="button"
              className={css.ViewDetails}
              onClick={(): void => setShowDetails(!showDetails)}
            >
              <span>{`${showDetails ? 'Hide' : 'Show'} details`}</span>
            </button>
          </div>
        </div>

        <Collapsable collapsed={!showDetails} className={css.DetailedView}>
          <div className={[commonCss.ContentWrapper, css.DetailedViewWrapper].join(' ')}>
            {items.map((item, idx) => {
              const { className: itemClassName, detailed, ...itemProps } = item.props;

              let width: number | undefined;

              if (itemsRef.current) {
                width = itemsRef.current.children[idx]?.clientWidth;
              }

              return (
                React.createElement<ShoppingCartItemProps<typeof item>>(
                  item.type,
                  {
                    ...itemProps,
                    detailed: true,
                    style: {
                      width,
                    },
                    className: css.DetailedItem,
                    key: `detailed-item-${idx}`,
                  },
                )
              );
            })}
          </div>
        </Collapsable>
      </div>
    </>
  );
}
