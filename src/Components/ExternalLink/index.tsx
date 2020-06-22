import React from 'react';

import css from './ExternalLink.module.css';
import openExternal from '../../Assets/Images/open-external.svg';

interface ExternalLinkProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  'rel' | 'target'
> {
  showIcon?: boolean;
  showIconAlt?: string;
  rel?: string;
  target?: string;
}

export default function ExternalLink({
  showIcon = true,
  rel = 'noopener noreferrer',
  target = '_blank',
  showIconAlt,
  children,
  ...props
}: ExternalLinkProps): JSX.Element {
  return (
    <a {...props} rel={rel} target={target}>
      {children}
      {showIcon && (
        <img src={openExternal} alt={showIconAlt} className={css.Icon} />
      )}
    </a>
  );
}
