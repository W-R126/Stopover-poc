import React from 'react';

import css from './Menu.module.css';

interface MenuProps {
  className?: string;
  headerClassName?: string;
  header: React.ReactNode;
  tabIndex: number;
}

interface MenuState {
  collapsed: boolean;
}

export default class Menu extends React.Component<MenuProps, MenuState> {
  static readonly defaultProps: Pick<MenuProps, 'tabIndex'> = {
    tabIndex: 0,
  };

  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: MenuProps) {
    super(props);

    this.state = {
      collapsed: true,
    };

    this.onClickOutside = this.onClickOutside.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener('click', this.onClickOutside);
    document.addEventListener('focusin', this.onClickOutside);
  }

  componentWillUnmount(): void {
    document.removeEventListener('click', this.onClickOutside);
    document.addEventListener('focusin', this.onClickOutside);
  }

  private onClickOutside(e: any): void {
    if (!this.selfRef.current || this.selfRef.current.contains(e.target)) {
      return;
    }

    this.collapse();
  }

  private onKeyDown(e: React.KeyboardEvent<HTMLDivElement>): void {
    switch (e.key) {
      case 'Escape':
        this.collapse();
        break;
      case ' ':
        this.expand();
        break;
      case 'Enter':
        this.toggle();
        break;
      default:
        break;
    }
    if (e.key === 'Enter') {
      this.toggle();
    }
  }

  private toggle(): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  private expand(): void {
    const { collapsed } = this.state;

    if (collapsed) {
      this.setState({ collapsed: false });
    }
  }

  private collapse(): void {
    const { collapsed } = this.state;

    if (!collapsed) {
      this.setState({ collapsed: true });
    }
  }

  render(): JSX.Element {
    const {
      className,
      headerClassName,
      tabIndex,
      header,
      children,
    } = this.props;
    const { collapsed } = this.state;

    const classList = [css.Menu];

    if (className) {
      classList.push(className);
    }

    const headerClassList = [css.Header];

    if (headerClassName) {
      headerClassList.push(headerClassName);
    }

    return (
      <div
        className={classList.join(' ')}
        aria-expanded={!collapsed}
        tabIndex={tabIndex}
        ref={this.selfRef}
        onKeyDown={this.onKeyDown}
        role="button"
      >
        <div
          className={headerClassList.join(' ')}
          onClick={this.toggle}
          role="button"
        >
          {header}
        </div>

        <div className={css.Body}>
          <div
            className={css.InnerHeader}
            onClick={this.toggle}
            role="button"
          >
            {header}
          </div>

          <div className={css.Content}>
            {children}
          </div>
        </div>
      </div>
    );
  }
}
