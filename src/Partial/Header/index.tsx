import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

import Logo from '../../Components/Logo';
import ContentService from '../../Services/ContentService';
import MainMenu from './MainMenu';

export interface HeaderProps {
  contentService: ContentService;
}

interface HeaderState {
  show: boolean;
  small: boolean;
  desktop: boolean;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  // Keeps track of current scrollY position.
  private scrollY = 0;

  // Keeps track of whether the header has loaded.
  private loaded = false;

  // Threshold for the header to be small.
  private smallThreshold = 90;

  // Threshold for mobile/desktop view.
  private modeThreshold = 768;

  constructor(props: HeaderProps) {
    super(props);

    this.state = {
      show: true,
      small: window.scrollY > this.smallThreshold,
      desktop: window.innerWidth > this.modeThreshold,
    };

    this.onScroll = this.onScroll.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  componentDidMount(): void {
    this.scrollY = window.scrollY;

    window.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
  }

  componentWillUnmount(): void {
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onResize);
  }

  private onResize(): void {
    const { innerWidth } = window;
    const { desktop } = this.state;

    if (innerWidth <= this.modeThreshold && desktop) {
      this.setState({ desktop: false });
    } else if (innerWidth > this.modeThreshold && !desktop) {
      this.setState({ desktop: true });
    }
  }

  private onScroll(): void {
    const { scrollY } = window;
    let direction: 'up' | 'down' = 'down';

    if (this.scrollY - scrollY > 0) {
      direction = 'up';
    }

    this.toggle(
      scrollY <= this.smallThreshold || direction === 'up',
      scrollY > this.smallThreshold,
    );

    this.scrollY = scrollY;
  }

  private getClassName(): string | undefined {
    const { show, small } = this.state;
    const result = [];

    if (show) {
      result.push('show');
    }

    if (small) {
      result.push('small');
    }

    return result.length === 0 ? undefined : result.join(' ');
  }

  private toggle(show: boolean, small: boolean): void {
    // Toggle show and small state.
    const { show: stateShow, small: stateSmall } = this.state;

    const newState = {};

    if (this.loaded && show !== stateShow) {
      Object.assign(newState, { show });
    }

    // Set loaded to true, this prevents the header from being hidden upon first load.
    this.loaded = true;

    if (small !== stateSmall) {
      Object.assign(newState, { small });
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  render(): JSX.Element {
    const { contentService } = this.props;
    const { small, desktop } = this.state;

    return (
      <>
        <header className={this.getClassName()}>
          <div className="content-wrapper">
            <Link to="/">
              <Logo
                contentService={contentService}
                display={{
                  airways: false,
                  arabic: !small && desktop,
                  chooseWell: !small && desktop,
                }}
              />
            </Link>
            <MainMenu contentService={contentService} />
          </div>
        </header>
        <div className="header-spacer" />
      </>
    );
  }
}
