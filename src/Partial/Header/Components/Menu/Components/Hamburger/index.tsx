import React from 'react';
import { NavLink } from 'react-router-dom';

import css from './Hamburger.module.css';
import searchIcon from '../../../../../../Assets/Images/search.svg';
import accountIcon from '../../../../../../Assets/Images/account.svg';
import { MenuItem } from '../../../../../../Models/MenuItem';
import HeaderLink from './Components/HeaderLink';
import Utils from '../../../../../../Utils';
import Input from '../../../../../../Components/UI/Input';

interface HamburgerProps {
  content: {
    common: {
      openExternal?: string;
      howCanWeHelp?: string;
      search?: string;
      account?: string;
      noResult?: string;
    };
    menu: MenuItem[];
  };
  visible: boolean;
  headerHeight: number;
}

interface HamburgerState {
  collapsed: boolean;
  filter: string;
}

export default class Hamburger extends React.Component<HamburgerProps, HamburgerState> {
  private readonly menuRef = React.createRef<HTMLDivElement>();

  private readonly buttonRef = React.createRef<HTMLButtonElement>();

  private readonly headerLinkRefs: (HeaderLink | null)[] = [];

  constructor(props: HamburgerProps) {
    super(props);

    this.state = {
      collapsed: true,
      filter: '',
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onClickOutside = this.onClickOutside.bind(this);
    this.onHeaderLinkExpand = this.onHeaderLinkExpand.bind(this);
    this.collapse = this.collapse.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('click', this.onClickOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
  }

  private onClickOutside(e: any): void {
    if (
      !(this.menuRef.current && this.buttonRef.current)
      || (this.menuRef.current.contains(e.target) || this.buttonRef.current.contains(e.target))
    ) {
      return;
    }

    this.collapse();
  }

  private async onToggle(): Promise<void> {
    const { collapsed } = this.state;

    document.body.style.overflow = collapsed ? 'hidden' : '';

    const newState = { collapsed: !collapsed };

    if (!collapsed) {
      Object.assign(newState, { filter: '' });
    }

    await new Promise((resolve) => this.setState(newState, resolve));
    this.toggleAll();
  }

  private onHeaderLinkExpand(index: number): void {
    this.headerLinkRefs.forEach((hlr, idx): void => {
      if (hlr && index !== idx) {
        hlr.collapse();
      }
    });
  }

  private async onFilterChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const filter = e.target.value;
    await new Promise((resolve) => this.setState({ filter }, resolve));
    await new Promise((resolve) => this.forceUpdate(resolve));

    this.toggleAll();
  }

  private toggleAll(): void {
    const { filter } = this.state;

    if (filter === '') {
      this.collapseAll();
    } else {
      this.expandAll();
    }
  }

  private collapseAll(): void {
    this.headerLinkRefs.forEach((hlr) => {
      if (hlr) {
        hlr.collapse();
      }
    });
  }

  private expandAll(): void {
    this.headerLinkRefs.forEach((hlr) => {
      if (hlr) {
        hlr.expand(true);
      }
    });
  }

  private filterMenu(menu: MenuItem[]): boolean {
    let { filter } = this.state;
    const newMenu = menu;

    if (filter === '') {
      return true;
    }

    filter = filter.toLowerCase();

    const del: MenuItem[] = [];

    for (let i = 0; i < newMenu.length; i += 1) {
      const item = newMenu[i];

      if (item.title && item.title.toLowerCase().indexOf(filter) === -1) {
        if (!(item.subMenu && this.filterMenu(item.subMenu))) {
          del.push(item);
        }
      }
    }

    del.forEach((item) => {
      newMenu.splice(newMenu.indexOf(item), 1);
    });

    return newMenu.length > 0;
  }

  private collapse(): void {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.onToggle();
    }
  }

  render(): JSX.Element {
    const { visible, content: { common, menu: propMenu }, headerHeight } = this.props;
    const { collapsed, filter } = this.state;

    const classList = [css.Hamburger];

    if (!visible) {
      classList.push(css.Hidden);
    }

    const menu: MenuItem[] = Utils.deepCopy(propMenu);

    this.filterMenu(menu);

    return (
      <div className={classList.join(' ')}>
        <ul className={css.Static}>
          <li>
            <NavLink to="/en/search" activeClassName={css.Active}>
              <img src={searchIcon} alt={common.search} />
            </NavLink>
          </li>

          <li>
            <a
              href="https://www.etihadguest.com/en/login-standalone.html"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img src={accountIcon} alt={common.account} />
            </a>
          </li>

          <li>
            <button
              ref={this.buttonRef}
              className={css.ToggleIcon}
              type="button"
              onClick={this.onToggle}
            >
              <span />
            </button>
          </li>
        </ul>

        <div aria-expanded={!collapsed} className={css.Menu} ref={this.menuRef}>
          <div style={{ height: headerHeight + 1 }} className={css.Header}>

            <Input
              className={css.Search}
              placeholder={common.howCanWeHelp}
              value={filter}
              onChange={this.onFilterChange}
            />

            <button
              className={css.ToggleIcon}
              type="button"
              onClick={this.onToggle}
            >
              <span />
            </button>
          </div>

          <div
            className={css.Content}
            style={{ height: `calc(100vh - ${headerHeight + 1}px)` }}
          >
            {menu.length === 0 && (
              <div className={css.NoResult}>
                {common.noResult}
              </div>
            )}
            {menu.map((item, idx) => (
              <HeaderLink
                ref={(ref): void => {
                  this.headerLinkRefs[idx] = ref;
                }}
                key={`item-${idx}`}
                item={item}
                content={{ common }}
                onExpand={(): void => this.onHeaderLinkExpand(idx)}
                onNavigate={this.collapse}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
