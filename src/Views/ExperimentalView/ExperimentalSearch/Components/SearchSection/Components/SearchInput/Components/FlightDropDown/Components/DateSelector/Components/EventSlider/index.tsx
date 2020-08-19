import React from 'react';

import css from './EventSlider.module.css';

interface EventSliderProps {
  eventItems: any[];
}

interface EventSliderState {
  isScrolling: boolean;
  clientX: number;
  scrollX: number;
}

export default class EventSlider extends React.Component<EventSliderProps, EventSliderState> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  constructor(props: EventSliderProps) {
    super(props);
    this.state = {
      isScrolling: false,
      clientX: 0,
      scrollX: 0,
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseDown(e: any): void{
    this.setState({
      isScrolling: true,
      clientX: e.clientX,
    });
  }

  onMouseUp(): void {
    this.setState({ isScrolling: false });
  }

  onMouseMove(e: any): void {
    const { clientX, scrollX } = this.state;
    const { isScrolling } = this.state;
    if (isScrolling && this.selfRef.current) {
      const newScrollX = scrollX - e.clientX + clientX;
      this.selfRef.current.scrollLeft = newScrollX;
      this.setState({
        scrollX: newScrollX,
        clientX: e.clientX,
      });
    }
  }

  onMouseLeave(e: any): void {
    const { isScrolling } = this.state;
    if (isScrolling) {
      this.setState({
        isScrolling: false,
      });
    }
  }

  render(): JSX.Element {
    const { isScrolling } = this.state;
    const { eventItems } = this.props;
    return (
      <div
        className={`${css.ComponentContainer} ${isScrolling ? css.Grabbing : ''}`}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onMouseMove={this.onMouseMove}
        onMouseLeave={this.onMouseLeave}
        ref={this.selfRef}
      >
        {eventItems.map((item) => (
          <div className={css.EventItem}>
            <img src={item.backImg} draggable={false} alt="Event Item" />
            <div className={css.EventContnet}>
              <div className={css.EventTitle}>
                <strong>{item.title}</strong>
                <br />
                {item.date}
              </div>
              <div className={css.LearnMore} role="button">Learn more</div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}
