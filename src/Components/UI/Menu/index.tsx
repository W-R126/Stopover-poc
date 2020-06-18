import React from 'react';

import css from './Menu.module.css';

interface MenuProps {
  className?: string;
}

interface MenuState {
  collapsed: boolean;
}

export default class Menu extends React.Component<MenuProps, MenuState> {
  constructor(props: MenuProps) {
    super(props);

    this.state = {
      collapsed: true,
    };
  }

  render(): JSX.Element {
    const { className, children } = this.props;
    const { collapsed } = this.state;

    const classList = [css.Menu];

    if (className) {
      classList.push(className);
    }

    return (
      <div
        className={classList.join(' ')}
        aria-expanded={!collapsed}
      >
        {children}
      </div>
    );
  }
}
