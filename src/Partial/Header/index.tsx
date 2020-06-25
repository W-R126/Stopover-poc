import React from 'react';
import { Link } from 'react-router-dom';

import css from './Header.module.css';
import EtihadLogo from '../../Components/EtihadLogo';
import Menu from './Components/Menu';
import ContentService from '../../Services/ContentService';

interface HeaderProps {
  contentService: ContentService;
}

interface HeaderState {
  collapsed: boolean;
  height: number;
  mode: 'desktop' | 'mobile';
  showBrandPlatform: boolean;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  private readonly desktopHeight = 90;

  private readonly mobileHeight = 60;

  private readonly mobileThreshold = 768;

  private readonly showBrandPlatformThreshold = 1200;

  private currScrollY = -1;

  constructor(props: HeaderProps) {
    super(props);

    this.state = {
      height: this.desktopHeight,
      collapsed: false,
      mode: 'desktop',
      showBrandPlatform: true,
    };

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount(): void {
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);

    this.onResize();
  }

  componentWillUnmount(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }

  private onScroll(): void {
    const { scrollY } = window;
    const { mode, collapsed, height } = this.state;
    const scrollHeight = mode === 'desktop' ? this.desktopHeight : this.mobileHeight;
    const newState: Partial<HeaderState> = {};

    let direction = 'up';

    if (this.currScrollY !== -1) {
      direction = scrollY > this.currScrollY ? 'down' : 'up';
    }

    this.currScrollY = scrollY;

    if (scrollY > scrollHeight && height === this.desktopHeight) {
      // Scroll is above threshold, set to mobile height.
      newState.height = this.mobileHeight;
    } else if (scrollY <= scrollHeight && height !== scrollHeight) {
      // Scroll is below threshold, set to current device height.
      newState.height = scrollHeight;
    }

    if (direction === 'down') {
      if (!collapsed && scrollY > scrollHeight) {
        // Hide header.
        newState.collapsed = true;
      }
    } else if (collapsed) {
      // Show header.
      newState.collapsed = false;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState as HeaderState);
    }
  }

  private onResize(): void {
    const { innerWidth } = window;
    const { mode, showBrandPlatform } = this.state;
    const newState: Partial<HeaderState> = {};

    if (innerWidth < this.showBrandPlatformThreshold && showBrandPlatform) {
      newState.showBrandPlatform = false;
    } else if (innerWidth > this.showBrandPlatformThreshold && !showBrandPlatform) {
      newState.showBrandPlatform = true;
    }

    if (mode === 'desktop' && innerWidth <= this.mobileThreshold) {
      // Switch to mobile.
      newState.mode = 'mobile';
      newState.height = this.mobileHeight;
    } else if (mode === 'mobile' && innerWidth > this.mobileThreshold) {
      // Switch to desktop.
      newState.mode = 'desktop';
      newState.height = this.desktopHeight;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState as HeaderState);
    }
  }

  render(): JSX.Element {
    const {
      collapsed,
      height,
      mode,
      showBrandPlatform,
    } = this.state;
    const { contentService } = this.props;

    document.body.style.paddingTop = `${mode === 'desktop'
      ? this.desktopHeight
      : this.mobileHeight}px`;

    return (
      <>
        <header
          className={css.Header}
          style={{
            height,
            top: collapsed ? -(height + 10) : 0,
          }}
        >
          <div className={css.Wrapper}>
            <Link to="/">
              <EtihadLogo
                showArabicWordmark={height === this.desktopHeight}
                showBrandPlatform={showBrandPlatform}
              />
            </Link>
            <Menu contentService={contentService} headerHeight={height} />
          </div>
        </header>
      </>
    );
  }
}
