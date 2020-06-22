import React from 'react';
import { NavLink } from 'react-router-dom';

import css from './Regular.module.css';
import searchIcon from '../../../../../../Assets/Images/search.svg';
import accountIcon from '../../../../../../Assets/Images/account.svg';
import { MenuItem } from '../../../../../../Models/MenuItem';
import ExternalLink from '../../../../../../Components/ExternalLink';

interface RegularProps {
  content: {
    common: {
      openExternal?: string;
      search?: string;
      account?: string;
    };
    menu: MenuItem[];
  };
  visible: boolean;
}

interface RegularState {
  hovered: boolean;
  hoveredIndex?: number;
}

export default class Regular extends React.Component<RegularProps, RegularState> {
  selfRef = React.createRef<HTMLDivElement>();

  constructor(props: RegularProps) {
    super(props);

    this.state = {
      hovered: false,
      hoveredIndex: undefined,
    };

    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.onCloseSubMenu = this.onCloseSubMenu.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('scroll', this.onScroll);
  }

  componentWillUnmount(): void {
    document.removeEventListener('scroll', this.onScroll);
  }

  private onScroll(): void {
    const { hovered } = this.state;

    if (hovered) {
      this.setState({ hoveredIndex: undefined, hovered: false });
    }
  }

  private async onMouseLeave(): Promise<void> {
    await new Promise((resolve) => this.setState({ hovered: false }, resolve));
    await new Promise((resolve) => setTimeout(resolve, 250));

    const { hovered } = this.state;

    if (!hovered) {
      this.setState({ hoveredIndex: undefined });
    }
  }

  private onCloseSubMenu(): void {
    this.setState({
      hoveredIndex: undefined,
      hovered: false,
    });
  }

  private renderSubMenu(items: MenuItem[] | undefined): JSX.Element | undefined {
    if (!items) {
      return undefined;
    }

    const { content: { common } } = this.props;

    return (
      <div className={css.SubMenu}>
        {items.map((item, idx) => (
          <div className={css.Category} key={`category-${idx}`}>
            <img src={item.imageUrl} alt={item.title} />
            <ul>
              <li className={css.Title}>
                {item.title}
              </li>
              {item.subMenu?.map((link, linkIdx) => (
                <li key={`link-${linkIdx}`}>
                  {link.external
                    ? (
                      <ExternalLink href={link.url} showIconAlt={common.openExternal}>
                        {link.title}
                      </ExternalLink>
                    )
                    : (
                      <NavLink
                        exact
                        to={link.url ?? ''}
                        activeClassName={css.Active}
                        onClick={this.onCloseSubMenu}
                      >
                        {link.title}
                      </NavLink>
                    )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  render(): JSX.Element {
    const { content: { menu, common }, visible } = this.props;
    const { hoveredIndex } = this.state;

    const classList = [css.Regular];

    if (!visible) {
      classList.push(css.Hidden);
    }

    return (
      <div
        className={classList.join(' ')}
        ref={this.selfRef}
        onMouseLeave={this.onMouseLeave}
      >
        <ul>
          {menu.map((item, idx) => (
            <li
              key={`menu-item-${idx}`}
              onMouseEnter={(): void => {
                if (item.external) {
                  this.setState({ hovered: false, hoveredIndex: undefined });
                } else {
                  this.setState({ hoveredIndex: idx, hovered: true });
                }
              }}
              className={hoveredIndex === idx ? css.Hover : undefined}
            >
              {item.external
                ? (
                  <ExternalLink href={item.url} showIconAlt={common.openExternal}>
                    {item.title}
                  </ExternalLink>
                )
                : (
                  <NavLink
                    to={item.url ?? ''}
                    activeClassName={css.Active}
                    onClick={this.onCloseSubMenu}
                  >
                    {item.title}
                  </NavLink>
                )}

              {this.renderSubMenu(item.subMenu)}
            </li>
          ))}

          <li>
            <NavLink to="/en/search" activeClassName={css.Active} className={css.Static}>
              <img src={searchIcon} alt={common.search} />
            </NavLink>
          </li>

          <li>
            <a
              href="https://www.etihadguest.com/en/login-standalone.html"
              rel="noopener noreferrer"
              target="_blank"
              className={css.Static}
            >
              <img src={accountIcon} alt={common.account} />
            </a>
          </li>
        </ul>
      </div>
    );
  }
}
