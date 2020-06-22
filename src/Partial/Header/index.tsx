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
    const newState = {};

    let direction = 'up';

    if (this.currScrollY !== -1) {
      direction = scrollY > this.currScrollY ? 'down' : 'up';
    }

    this.currScrollY = scrollY;

    if (scrollY > scrollHeight && height === this.desktopHeight) {
      // Scroll is above threshold, set to mobile height.
      Object.assign(newState, { height: this.mobileHeight });
    } else if (scrollY <= scrollHeight && height !== scrollHeight) {
      // Scroll is below threshold, set to current device height.
      Object.assign(newState, { height: scrollHeight });
    }

    if (direction === 'down') {
      if (!collapsed && scrollY > scrollHeight) {
        // Hide header.
        Object.assign(newState, { collapsed: true });
      }
    } else if (collapsed) {
      // Show header.
      Object.assign(newState, { collapsed: false });
    }

    this.setState(newState);
  }

  private onResize(): void {
    const { innerWidth } = window;
    const { mode, showBrandPlatform } = this.state;
    const newState = {};

    if (innerWidth < this.showBrandPlatformThreshold && showBrandPlatform) {
      Object.assign(newState, { showBrandPlatform: false });
    } else if (innerWidth > this.showBrandPlatformThreshold && !showBrandPlatform) {
      Object.assign(newState, { showBrandPlatform: true });
    }

    if (mode === 'desktop' && innerWidth <= this.mobileThreshold) {
      // Switch to mobile.
      Object.assign(newState, { mode: 'mobile', height: this.mobileHeight });
    } else if (mode === 'mobile' && innerWidth > this.mobileThreshold) {
      // Switch to desktop.
      Object.assign(newState, { mode: 'desktop', height: this.desktopHeight });
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
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
        <div
          className={css.HeaderSpacer}
          style={{
            height: mode === 'desktop' ? this.desktopHeight : this.mobileHeight,
          }}
        />
      </>
    );
  }
}
