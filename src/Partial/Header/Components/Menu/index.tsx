import React from 'react';

import css from './Menu.module.css';
import ContentService from '../../../../Services/ContentService';
import Regular from './Components/Regular';
import Hamburger from './Components/Hamburger';
import { MenuItem } from '../../../../Models/MenuItem';

interface MenuProps {
  contentService: ContentService;
  headerHeight: number;
}

interface MenuState {
  content: {
    common: {
      openExternal?: string;
      howCanWeHelp?: string;
      search?: string;
      account?: string;
    };
    menu: MenuItem[];
  };
  menuType: 'regular' | 'hamburger';
}

export default class Menu extends React.Component<MenuProps, MenuState> {
  private readonly regularRef = React.createRef<Regular>();

  constructor(props: MenuProps) {
    super(props);

    this.state = {
      content: {
        common: {},
        menu: [],
      },
      menuType: 'regular',
    };

    this.onResize = this.onResize.bind(this);
  }

  async componentDidMount(): Promise<void> {
    const { contentService } = this.props;
    const { content } = this.state;

    const commonReq = contentService.get('common');
    const menuReq = contentService.get('mainMenu');

    Object.assign(content, {
      common: await commonReq,
      menu: await menuReq,
    });

    window.addEventListener('resize', this.onResize);

    await new Promise((resolve) => this.setState({ content }, resolve));
    this.onResize();

    // Fix bug where menu type doesn't change on reload at 1000-ish pixels.
    setTimeout(this.onResize, 20);
  }

  componentWillUnmount(): void {
    window.removeEventListener('resize', this.onResize);
  }

  private onResize(): void {
    if (!this.regularRef.current || !this.regularRef.current.selfRef.current) {
      return;
    }

    const { menuType } = this.state;
    const regularHeight = this.regularRef.current.selfRef.current.scrollHeight;
    const maxHeight = this.regularRef.current.selfRef.current.clientHeight;

    if (menuType === 'regular' && regularHeight > maxHeight) {
      this.setState({ menuType: 'hamburger' });
    } else if (menuType === 'hamburger' && regularHeight <= maxHeight) {
      this.setState({ menuType: 'regular' });
    }
  }

  render(): JSX.Element {
    const { content, menuType } = this.state;
    const { headerHeight } = this.props;

    return (
      <nav className={css.Menu}>
        <Hamburger
          content={content}
          visible={menuType === 'hamburger'}
          headerHeight={headerHeight}
        />
        <Regular content={content} ref={this.regularRef} visible={menuType === 'regular'} />
      </nav>
    );
  }
}
