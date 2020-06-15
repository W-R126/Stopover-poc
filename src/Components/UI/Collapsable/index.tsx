import React from 'react';

import css from './Collapsable.module.css';

interface CollapsableProps {
  collapsed: boolean;
  className?: string;
  transitionTimeMs: number;
  children?: React.ReactNode;
}

interface CollapsableState {
  maxHeight?: number;
}

export default class Collapsable extends React.Component<CollapsableProps, CollapsableState> {
  static readonly defaultProps = {
    transitionTimeMs: 300,
  };

  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: CollapsableProps) {
    super(props);

    this.state = {
      maxHeight: 0,
    };
  }

  componentDidMount(): void {
    this.setMaxHeight();
  }

  componentDidUpdate(prevProps: CollapsableProps): void {
    const { collapsed, children } = this.props;

    if (collapsed === prevProps.collapsed && children === prevProps.children) {
      return;
    }

    this.setMaxHeight();
  }

  private async setMaxHeight(): Promise<void> {
    const { collapsed } = this.props;

    const maxHeight = this.selfRef.current?.scrollHeight ?? 0;

    this.setState({ maxHeight: collapsed ? 0 : maxHeight });
  }

  render(): JSX.Element {
    const { className, children, transitionTimeMs } = this.props;
    const { maxHeight } = this.state;

    const classList = [css.Collapsable];

    if (className) {
      classList.push(className);
    }

    return (
      <div
        className={classList.join(' ')}
        ref={this.selfRef}
        style={{
          maxHeight,
          transition: `max-height ${transitionTimeMs}ms`,
        }}
      >
        {children}
      </div>
    );
  }
}
