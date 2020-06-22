import React from 'react';
import { NavLink } from 'react-router-dom';

import css from './Category.module.css';
import { MenuItem } from '../../../../../../../../Models/MenuItem';
import ExternalLink from '../../../../../../../../Components/ExternalLink';

interface CategoryProps {
  item: MenuItem;
  content: {
    common: {
      openExternal?: string;
    };
  };
  onNavigate?: () => void;
}

export default function Category({
  item,
  content: { common },
  onNavigate,
}: CategoryProps): JSX.Element {
  return (
    <ul>
      <li className={css.Title}>
        {item.imageUrl && (<img src={item.imageUrl} alt={item.title} />)}
        {item.title}
      </li>

      {item.subMenu?.map((link, idx) => (
        <li key={`link-${idx}`} className={css.Link}>
          {link.external
            ? (
              <ExternalLink
                href={link.url}
                showIconAlt={common.openExternal}
                onClick={onNavigate}
              >
                {link.title}
              </ExternalLink>
            )
            : (
              <NavLink
                to={link.url ?? ''}
                activeClassName={css.Active}
                exact
                onClick={onNavigate}
              >
                {link.title}
              </NavLink>
            )}
        </li>
      ))}
    </ul>
  );
}
