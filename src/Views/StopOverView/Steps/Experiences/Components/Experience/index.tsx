import React from 'react';

import css from './Experience.module.css';
import { ExperienceModel } from '../../../../../../Models/ExperienceModel';
import Utils from '../../../../../../Utils';
import DateUtils from '../../../../../../DateUtils';

interface ExperienceProps {
  className?: string;
  data: ExperienceModel;
  onDragStart: () => void;
  onDragEnd: () => void;
}

export default class Experience extends React.Component<ExperienceProps> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  private clone?: HTMLDivElement;

  private yOffset = 0;

  private xOffset = 0;

  constructor(props: ExperienceProps) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDrag = this.onDrag.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
  }

  componentWillUnmount(): void {
    if (this.clone && document.body.contains(this.clone)) {
      document.body.removeChild(this.clone);
    }
  }

  private onMouseDown(e: React.MouseEvent<HTMLDivElement>): void {
    const selfRef = this.selfRef.current;

    if (!selfRef) {
      return;
    }

    const boundingRect = selfRef.getBoundingClientRect();

    this.yOffset = e.clientY - boundingRect.top;
    this.xOffset = e.clientX - boundingRect.left;
  }

  private onDragStart(e: React.DragEvent<HTMLDivElement>): void {
    const selfRef = this.selfRef.current;

    if (!selfRef) {
      return;
    }

    const { onDragStart, data } = this.props;

    e.dataTransfer.setData('text/plain', data.id.toString());

    onDragStart();

    this.clone = selfRef.cloneNode(true) as HTMLDivElement;
    e.dataTransfer.setDragImage(selfRef.cloneNode() as HTMLDivElement, 0, 0);

    const boundingRect = selfRef.getBoundingClientRect();

    this.clone.style.width = `${selfRef.clientWidth}px`;
    this.clone.style.top = `${boundingRect.top}px`;
    this.clone.style.left = `${boundingRect.left}px`;
    this.clone.style.transformOrigin = `${this.xOffset}px ${this.yOffset}px`;
    this.clone.classList.add(css.Dragging);

    selfRef.style.opacity = '0.3';

    document.body.appendChild(this.clone);
  }

  private onDragEnd(): void {
    const selfRef = this.selfRef.current;

    if (!(this.clone && selfRef)) {
      return;
    }

    selfRef.style.opacity = '';

    document.body.removeChild(this.clone);

    const { onDragEnd } = this.props;

    onDragEnd();
  }

  private onDrag(e: React.DragEvent<HTMLDivElement>): void {
    if (!this.clone) {
      return;
    }

    this.clone.style.left = `${e.clientX - this.xOffset}px`;
    this.clone.style.top = `${e.clientY - this.yOffset}px`;
  }

  render(): JSX.Element {
    const { className, data } = this.props;
    const classList = [css.Experience];

    if (className) {
      classList.push(className);
    }

    return (
      <div
        ref={this.selfRef}
        className={classList.join(' ')}
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onMouseDown={this.onMouseDown}
        onDrag={this.onDrag}
        draggable
        role="button"
      >
        {data.recommended
          ? (
            <div className={css.Recommended}>
              Recommended
            </div>
          )
          : (<div />)}

        <div className={css.DragHint}>
          <span />
          <span />
          <span />
        </div>

        <div className={css.Info}>
          <img className={css.Image} src={data.image?.url} alt={data.image?.alt} />

          <div className={css.Details}>
            <strong className={css.Title}>{data.title}</strong>
            <span className={css.Location}>{data.location}</span>
            <span className={css.OpeningHours}>
              {data.timeSlots
                ? 'Limited time slots'
                : `${DateUtils.getHHMM(data.opens)} - ${
                  DateUtils.getHHMM(data.closes)
                }`}
            </span>
          </div>

          <div className={css.Pricing}>
            <span className={css.Quantity}>Per person</span>
            <strong className={css.Price}>
              {`${data.currency} ${Utils.formatCurrency(data.prices.adult)}`}
            </strong>
            <button type="button" className={css.ViewDetails}>
              View details
            </button>
          </div>
        </div>
      </div>
    );
  }
}
