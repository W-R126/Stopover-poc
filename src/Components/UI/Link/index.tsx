import React, { CSSProperties } from 'react';
import { NavLink, Link as RouteLink } from 'react-router-dom';

import openExternal from '../../../Assets/Images/UI/open-external.svg';

interface LinkProps {
  title?: string;
  url?: string;
  image?: {
    url?: string;
    alt?: string;
  };
  external?: boolean;
  navLink?: boolean;
  content?: {
    opensInNewWindow?: string;
  };
  exact?: boolean;
  className?: string;
  style?: CSSProperties;
}

export default function Link(props: LinkProps): JSX.Element {
  const {
    title,
    url,
    image,
    external,
    navLink,
    content,
    exact,
    className,
    style,
  } = props;

  let linkContent: string | JSX.Element | undefined = title;

  if (image) {
    linkContent = (<img src={image.url} alt={image.alt} />);
  }

  if (external) {
    return (
      <a href={url} target="_blank" rel="noreferrer noopener" className={className} style={style}>
        {linkContent}
        {!image && (
          <img
            src={openExternal}
            alt={content?.opensInNewWindow}
            className="open-external-link"
          />
        )}
      </a>
    );
  }

  if (navLink) {
    return (
      <NavLink to={url ?? ''} exact={exact} className={className} style={style}>
        {linkContent}
      </NavLink>
    );
  }

  return (
    <RouteLink to={url ?? ''} className={className} style={style}>
      {linkContent}
    </RouteLink>
  );
}
