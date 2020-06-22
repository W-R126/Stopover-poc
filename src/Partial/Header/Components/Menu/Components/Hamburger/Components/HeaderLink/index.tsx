import React from 'react';
import { NavLink } from 'react-router-dom';

import css from './HeaderLink.module.css';
import { MenuItem } from '../../../../../../../../Models/MenuItem';
import ExternalLink from '../../../../../../../../Components/ExternalLink';
import Category from '../Category';
import Collapsable from '../../../../../../../../Components/UI/Collapsable';

interface HeaderLinkProps {
  content: {
    common: {
      openExternal?: string;
    };
  };
  item: MenuItem;
  onExpand?: () => void;
  onNavigate?: () => void;
}

interface HeaderLinkState {
  collapsed: boolean;
}

export default class HeaderLink extends React.Component<HeaderLinkProps, HeaderLinkState> {
  constructor(props: HeaderLinkProps) {
    super(props);

    this.state = {
      collapsed: true,
    };

    this.expand = this.expand.bind(this);
    this.collapse = this.collapse.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  expand(ignoreOnExpand = false): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.toggle(ignoreOnExpand);
    }
  }

  collapse(): void {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.toggle();
    }
  }

  toggle(ignoreOnExpand = false): void {
    const { collapsed } = this.state;
    const { onExpand } = this.props;

    if (collapsed && onExpand && !ignoreOnExpand) {
      onExpand();
    }

    this.setState({ collapsed: !collapsed });
  }

  render(): JSX.Element {
    const { content: { common }, item, onNavigate } = this.props;
    const { collapsed } = this.state;

    return (
      <ul
        className={css.HeaderLink}
        aria-expanded={!collapsed}
      >
        <li className={css.Header}>
          <span
            className={item.external ? css.External : undefined}
            role="button"
            onClick={item.subMenu ? (): void => this.toggle() : undefined}
          >
            {item.external
              ? (
                <ExternalLink
                  showIconAlt={common.openExternal}
                  href={item.url}
                  onClick={onNavigate}
                >
                  {item.title}
                </ExternalLink>
              )
              : (
                <NavLink
                  to={item.url ?? ''}
                  activeClassName={css.Active}
                  onClick={onNavigate}
                >
                  {item.title}
                </NavLink>
              )}
          </span>
        </li>
        {item.subMenu && (
          <li>
            {item.subMenu.map((category, categoryIdx) => (
              <Collapsable
                collapsed={collapsed}
                key={`category-${categoryIdx}`}
                transitionTimeMs={500}
              >
                <Category
                  item={category}
                  content={{ common }}
                  onNavigate={onNavigate}
                />
              </Collapsable>
            ))}
          </li>
        )}
      </ul>
    );
  }
}
