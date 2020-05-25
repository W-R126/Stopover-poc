import React from 'react';

import './MainMenuDesktop.css';
import './MainMenuMobile.css';
import hamburgerIcon from '../../Assets/Images/UI/hamburger-icon.svg';
import ContentService from '../../Services/ContentService';
import Link from '../../Components/UI/Link';

interface Image {
  url?: string;
  alt?: string;
}

interface CategoryItem {
  title?: string;
  url?: string;
  external?: boolean;
}

interface Category {
  title?: string;
  image?: Image;
  links?: CategoryItem[];
}

interface MainMenuItem {
  title?: string;
  image?: Image;
  external?: boolean;
  url?: string;
  categories?: Category[];
}

interface MainMenuProps {
  contentService: ContentService;
}

interface MainMenuState {
  content: {
    menu?: MainMenuItem[];
    common?: {
      opensInNewWindow?: string;
      close?: string;
      open?: string;
      expand?: string;
    };
  };
}

export default class MainMenu extends React.Component<MainMenuProps, MainMenuState> {
  private selfRef = React.createRef<HTMLUListElement>();

  private checkboxRef = React.createRef<HTMLInputElement>();

  constructor(props: MainMenuProps) {
    super(props);

    this.state = {
      content: {},
    };

    this.onClickOutside = this.onClickOutside.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { contentService } = this.props;

    document.addEventListener('click', this.onClickOutside);

    const commonReq = contentService.get('common');
    const mainMenuReq = contentService.get('mainMenu');

    this.setState({
      content: {
        menu: await mainMenuReq,
        common: await commonReq,
      },
    });
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
  }

  private onClickOutside(e: any): void {
    if (!(this.selfRef.current && this.checkboxRef.current)) {
      return;
    }

    if (!this.checkboxRef.current.checked || this.checkboxRef.current === e.target) {
      return;
    }

    if (!this.selfRef.current.contains(e.target) || e.target instanceof HTMLAnchorElement) {
      this.checkboxRef.current.checked = false;
    }
  }

  private expand(idx: number): void {
    const menuItems = document.querySelectorAll<HTMLLIElement>('.main-menu-item.expandable');

    const isExpanded = menuItems[idx].classList.contains('expanded');

    menuItems.forEach((item) => {
      item.classList.remove('expanded');
      item.setAttribute('style', '');
    });

    if (!isExpanded) {
      const header = menuItems[idx].querySelector<HTMLAnchorElement>('a');
      const categories = menuItems[idx].querySelector<HTMLUListElement>('.main-menu-categories');
      const maxHeight = (
        (categories?.getBoundingClientRect().height ?? 0)
        + (header?.getBoundingClientRect().height ?? 0)
      );

      menuItems[idx].classList.add('expanded');
      menuItems[idx].style.maxHeight = `${maxHeight}px`;
    }
  }

  render(): JSX.Element {
    const { content: { menu, common } } = this.state;

    const textLinks = menu?.filter((item) => item.image === undefined);
    const imageLinks = menu?.filter((item) => item.image !== undefined);

    return (
      <nav className="main-menu">
        <input type="checkbox" id="main-menu-checkbox" ref={this.checkboxRef} />
        <ul
          className="main-menu-items"
          ref={this.selfRef}
        >
          <li className="hamburger-menu-header">
            How can we help you?
            <label htmlFor="main-menu-checkbox" />
          </li>

          {textLinks?.map((mainMenuItem, mainMenuItemIdx) => (
            <li
              key={`main-menu-item-${mainMenuItemIdx}`}
              className={`main-menu-item${mainMenuItem.categories ? ' expandable' : ''}`}
            >
              <Link content={common} {...mainMenuItem} navLink />
              <span
                role="button"
                onClick={(): void => this.expand(mainMenuItemIdx)}
              >
                {common?.expand}
              </span>

              {mainMenuItem.categories && (
                <ul className="main-menu-categories">
                  {mainMenuItem.categories.map((category, categoryIdx) => (
                    <li key={`main-menu-category-${categoryIdx}`} className="main-menu-category">

                      {category.image && (
                        <img src={category.image.url} alt={category.image.alt} />
                      )}

                      <ul className="main-menu-category-items">
                        <li className="main-menu-category-item-header">
                          {category.title}
                        </li>

                        {category.links?.map((linkItem, idx) => (
                          <li
                            className="main-menu-category-item"
                            key={`main-menu-category-item-${idx}`}
                          >
                            <Link content={common} {...linkItem} navLink exact />
                          </li>
                        ))}

                      </ul>
                    </li>
                  ))}
                </ul>
              )}

            </li>
          ))}

        </ul>
        <ul className="main-menu-image-items">

          {imageLinks?.map((mainMenuItem, mainMenuItemIdx) => (
            <li key={`main-menu-item-${mainMenuItemIdx}`} className="main-menu-item">
              <Link content={common} {...mainMenuItem} navLink />
            </li>
          ))}

          <li className="main-menu-item hamburger-menu">
            <label htmlFor="main-menu-checkbox">
              <img src={hamburgerIcon} alt={common?.open} />
            </label>
          </li>
        </ul>
      </nav>
    );
  }
}
