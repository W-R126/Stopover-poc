import React from 'react';

import css from './SelectedExperience.module.css';
import Utils from '../../../../../../Utils';
import DateUtils from '../../../../../../DateUtils';
import { ExperienceAvailabilityModel, ExperienceModel } from '../../../../../../Models/ExperienceModelNew';

interface SelectedExperienceProps {
  className?: string;
  data: {
    selectedTimeSlot: Date;
    experience: ExperienceModel;
  };
  timeSlots: ExperienceAvailabilityModel[];
  guests: number;
  onRemove: () => void;
  onSelectTimeSlot: (timeSlot: Date) => void;
}

export default class SelectedExperience extends React.Component<
  SelectedExperienceProps
> {
  private readonly selfRef = React.createRef<HTMLDivElement>();

  private clone?: HTMLDivElement;

  private yOffset = 0;

  private xOffset = 0;

  constructor(props: SelectedExperienceProps) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onDrag = this.onDrag.bind(this);
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

    const { data } = this.props;

    e.dataTransfer.setData('text/plain', data.experience.id);

    this.clone = selfRef.cloneNode(true) as HTMLDivElement;
    e.dataTransfer.setDragImage(selfRef.cloneNode() as HTMLDivElement, 0, 0);

    const boundingRect = selfRef.getBoundingClientRect();

    this.clone.style.width = `${selfRef.clientWidth}px`;
    this.clone.style.top = `${boundingRect.top}px`;
    this.clone.style.left = `${boundingRect.left}px`;
    this.clone.classList.add(css.Dragging);

    selfRef.style.opacity = '0';

    document.body.appendChild(this.clone);
  }

  private onDragEnd(): void {
    const selfRef = this.selfRef.current;

    if (!(this.clone && selfRef)) {
      return;
    }

    selfRef.style.opacity = '';

    document.body.removeChild(this.clone);
  }

  private onDrag(e: React.DragEvent<HTMLDivElement>): void {
    if (!this.clone) {
      return;
    }

    this.clone.style.left = `${e.clientX - this.xOffset}px`;
    this.clone.style.top = `${e.clientY - this.yOffset}px`;
  }

  render(): JSX.Element {
    const {
      className,
      data,
      onRemove,
      timeSlots,
      guests,
      onSelectTimeSlot,
    } = this.props;

    const { selectedTimeSlot, experience } = data;

    const classList = [css.SelectedExperience];

    if (className) {
      classList.push(className);
    }

    return (
      <div
        ref={this.selfRef}
        className={classList.join(' ')}
        draggable
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}
        onDrag={this.onDrag}
        onMouseDown={this.onMouseDown}
        role="button"
      >
        <div className={css.Details}>
          <span className={css.DragHint}>
            <span />
            <span />
            <span />
          </span>

          <span className={css.Title}>{experience.title}</span>

          <div className={css.Quantity}>
            {`${guests} Guests`}
          </div>

          <span className={css.Price}>
            {`${experience.startingFromPrice.currency} ${
              Utils.formatCurrency(experience.startingFromPrice.total * guests)
            }`}
          </span>

          <button type="button" className={css.Remove} onClick={onRemove}>
            ×
          </button>
        </div>

        {timeSlots && (
          <div className={css.Time}>
            <span>Please select your preferred time slot</span>

            <div className={css.TimeSlots}>
              {timeSlots.map((timeSlot, idx) => {
                const id = `selected-experience-${experience.id}-${timeSlot.start.valueOf()}`;

                const { start } = timeSlot;
                const end = new Date(start);
                end.setMinutes(end.getMinutes() + experience.duration);

                return (
                  <div className={css.TimeSlot} key={`time-slot-${idx}`}>
                    <input
                      type="radio"
                      checked={selectedTimeSlot?.valueOf() === start.valueOf()}
                      id={id}
                      onChange={(): void => onSelectTimeSlot(start)}
                    />

                    <label htmlFor={id}>
                      {`${DateUtils.getHHMM(start)}${
                        end
                          ? ` - ${DateUtils.getHHMM(end)}`
                          : ''
                      }`}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}
