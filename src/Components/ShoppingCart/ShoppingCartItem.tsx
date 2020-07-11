import React from 'react';

import css from './ShoppingCart.module.css';

interface ShoppingCartItem {
  className?: string;
  price: number;
  children: React.ReactNode;
}

export default function ShoppingCartItem({
  className,
  children,
}: ShoppingCartItem): JSX.Element {
  const classList = [css.ShoppingCartItem];

  if (className) {
    classList.push(className);
  }

  return (
    <div className={classList.join(' ')}>
      {children}
    </div>
  );
}
