import React from 'react';

import css from './Collapsable.module.css';

interface CollapsableProps {
  collapsed: boolean;
  className?: string;
  transitionTimeMs: number;
  children?: React.ReactNode;
}

interface CollapsableState {
  height?: number;
}

export default class Collapsable extends React.Component<CollapsableProps, CollapsableState> {
  static readonly defaultProps: Pick<CollapsableProps, 'transitionTimeMs'> = {
    transitionTimeMs: 300,
  };

  private readonly wrapperRef = React.createRef<HTMLDivElement>();

  constructor(props: CollapsableProps) {
    super(props);

    this.state = {
      height: 0,
    };
  }

  componentDidMount(): void {
    this.setHeight();
  }

  componentDidUpdate(prevProps: CollapsableProps): void {
    const { collapsed, children } = this.props;

    if (collapsed === prevProps.collapsed && children === prevProps.children) {
      return;
    }

    this.setHeight();
  }

  private async setHeight(): Promise<void> {
    const { collapsed } = this.props;

    const height = this.wrapperRef.current?.scrollHeight ?? 0;

    this.setState({ height: collapsed ? 0 : height });
  }

  render(): JSX.Element {
    const { className, children, transitionTimeMs } = this.props;
    const { height } = this.state;

    const classList = [css.Collapsable];

    if (className) {
      classList.push(className);
    }

    return (
      <div
        className={classList.join(' ')}
        style={{
          height,
          transition: `height ${transitionTimeMs}ms`,
        }}
      >
        <div ref={this.wrapperRef}>
          {children}
        </div>
      </div>
    );
  }
}
