import React from 'react';

import css from './Experiences.module.css';
import rafflesIcon from '../../../../Assets/Images/raffles.svg';
import spinnerIcon from '../../../../Assets/Images/spinner.svg';
import { ExperienceModel } from '../../../../Models/ExperienceModel';
import Experience from './Components/Experience';
import { ExperienceCategoryEnum } from '../../../../Enums/ExperienceCategoryEnum';
import SelectedExperience from './Components/SelectedExperience';
import DateUtils from '../../../../DateUtils';
import { TripModel } from '../../../../Models/TripModel';
import AppState from '../../../../AppState';
import { ExperienceDateModel } from '../../../../Models/ExperienceDateModel';
import ExperienceService from '../../../../Services/ExperienceService';
import { StopOverModel } from '../../../../Models/StopOverModel';
import ExperienceInfoModal from './Components/ExperienceInfoModal';

interface ExperiencesProps {
  startDate: Date;
  endDate: Date;
  stopOverInfo: StopOverModel;
  experienceService: ExperienceService;
  onExperiencesChange: (experiences: ExperienceDateModel[]) => void;
}

interface ExperiencesState {
  selectedCategory: ExperienceCategoryEnum;
  experiences?: ExperienceModel[];
  experienceDates: ExperienceDateModel[];
  dragging?: 'experience' | 'selectedExperience';
  trip: TripModel;
  startDate: Date;
  endDate: Date;
  guests: number;
  showDetails?: ExperienceModel;
}

export default class Experiences extends React.Component<ExperiencesProps, ExperiencesState> {
  constructor(props: ExperiencesProps) {
    super(props);

    let { startDate, endDate } = props;
    startDate = new Date(startDate);
    startDate.setDate(startDate.getDate() + 1);
    endDate = new Date(endDate);
    endDate.setDate(endDate.getDate() - 1);

    const trip = AppState.tripSearch as TripModel;

    this.state = {
      selectedCategory: ExperienceCategoryEnum.all,
      experiences: undefined,
      experienceDates: AppState.experienceDates,
      dragging: undefined,
      trip,
      startDate,
      endDate,
      guests: (
        trip.passengers.adults
        + trip.passengers.children
        + trip.passengers.infants
      ),
      showDetails: undefined,
    };
  }

  componentDidMount(): void {
    const { experienceDates, startDate, endDate } = this.state;

    this.getExperiences();

    const nextExperienceDates: ExperienceDateModel[] = [];
    const daysDelta = DateUtils.getDaysDelta(startDate, endDate);

    for (let i = 0; i <= daysDelta; i += 1) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      const next = experienceDates.find(
        (ed) => ed.date.toLocaleDateString('sv-SE') === date.toLocaleDateString('sv-SE'),
      ) ?? { date, experiences: [] };

      nextExperienceDates.push(next);
    }

    this.setState({ experienceDates: nextExperienceDates });
  }

  private onSelectCategory(selectedCategory: ExperienceCategoryEnum): void {
    this.setState({ selectedCategory });
  }

  private onDragLeave(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();

    const target = e.target as HTMLDivElement;

    if (target.classList.contains(css.SelectedExperiences)) {
      target.classList.remove(css.Hover);
    }
  }

  private onDragOver(e: React.DragEvent<HTMLDivElement>): void {
    e.preventDefault();
  }

  private onDragEnter(e: React.DragEvent<HTMLDivElement>): void {
    const target = e.target as HTMLDivElement;

    if (target.classList.contains(css.SelectedExperiences)) {
      target.classList.add(css.Hover);
    }
  }

  private onDropExperience(
    experienceDate: ExperienceDateModel,
    e: React.DragEvent<HTMLDivElement>,
  ): void {
    const { experiences, guests } = this.state;
    const target = e.target as HTMLDivElement;

    target.classList.remove(css.Hover);

    if (!experiences) {
      return;
    }

    const id = e.dataTransfer.getData('text/plain');
    const experience = experiences.find((item) => item.id === id);

    if (experience) {
      const { experienceDates } = this.state;

      const availability = experience.availability.filter(
        (value) => (
          value.start.valueOf() >= experienceDate.date.valueOf()
          && value.end.valueOf() <= experienceDate.date.valueOf() + 86400000
        ),
      );

      if (availability.length === 0) {
        this.setState({ dragging: undefined });

        alert('No time slots available for this day.');

        return;
      }

      experienceDate.experiences.push({
        experience,
        guests,
        selectedTimeSlot: availability[0].start,
      });

      this.updateSelected(experienceDates);
    }

    this.setState({ dragging: undefined });
  }

  private onDropSelectedExperience(
    experienceDate: ExperienceDateModel,
    e: React.DragEvent<HTMLDivElement>,
  ): void {
    const { experiences, guests } = this.state;
    const target = e.target as HTMLDivElement;

    target.classList.remove(css.Hover);

    if (!experiences) {
      return;
    }

    const id = e.dataTransfer.getData('text/plain');
    const experience = experiences.find((item) => item.id === id);

    if (experience) {
      const { experienceDates } = this.state;

      const availability = experience.availability.filter(
        (value) => (
          value.start.valueOf() >= experienceDate.date.valueOf()
          && value.end.valueOf() <= experienceDate.date.valueOf() + 86400000
        ),
      );

      if (availability.length === 0) {
        this.setState({ dragging: undefined });

        alert('No time slots available for this day.');

        return;
      }

      experienceDates.forEach((item) => {
        // Remove experience from previous date if it's already added.
        const idx = item.experiences.findIndex((item2) => item2.experience.id === experience.id);

        if (idx !== -1) {
          item.experiences.splice(idx, 1);
        }
      });

      experienceDate.experiences.push({
        experience,
        guests,
        selectedTimeSlot: availability[0].start,
      });

      this.updateSelected(experienceDates);
    }

    this.setState({ dragging: undefined });
  }

  private onRemove(experience: ExperienceModel): void {
    const { experienceDates } = this.state;

    const experienceDate = experienceDates.find(
      (ed) => ed.experiences.findIndex((item) => item.experience === experience) !== -1,
    );

    if (experienceDate) {
      experienceDate.experiences.splice(experienceDate.experiences.findIndex(
        (item) => item.experience.id === experience.id,
      ), 1);

      this.updateSelected(experienceDates);
    }

    this.forceUpdate();
  }

  private async getExperiences(): Promise<void> {
    const {
      stopOverInfo,
      experienceService,
    } = this.props;

    const { trip, startDate, endDate } = this.state;

    const experiences = await experienceService.getExperiences(
      trip.passengers,
      startDate,
      endDate,
      stopOverInfo.customerSegmentCode,
    );

    this.setState({ experiences });
  }

  private getFilteredExperiences(): ExperienceModel[] | undefined {
    const { experiences, selectedCategory, experienceDates } = this.state;

    if (!experiences) {
      return undefined;
    }

    const selectedExperiences = experienceDates.reduce(
      (prev, curr) => prev.concat(curr.experiences.map((exp) => exp.experience)),
      ([] as ExperienceModel[]),
    );

    let finalExperiences = experiences;

    if (selectedCategory !== ExperienceCategoryEnum.all) {
      finalExperiences = experiences.filter(
        (experience) => experience.categories.indexOf(7) !== -1, // TODO: Classify categories
      );
    }

    return finalExperiences.filter(
      (experience) => selectedExperiences.findIndex((exp) => exp.id === experience.id) === -1,
    );
  }

  private selectTimeSlot(experience: ExperienceModel, date: Date): void {
    const { experienceDates } = this.state;

    experienceDates.forEach((expd) => {
      const exp = expd.experiences.find((item) => item.experience.id === experience.id);

      if (!exp) {
        return;
      }

      exp.selectedTimeSlot = date;
    });

    this.updateSelected(experienceDates);
    this.setState({ experienceDates });
  }

  private updateSelected(experienceDates: ExperienceDateModel[]): void {
    const { onExperiencesChange } = this.props;

    onExperiencesChange(experienceDates);
  }

  private toggleDetails(showDetails?: ExperienceModel): void {
    this.setState({ showDetails });
  }

  render(): JSX.Element {
    const {
      selectedCategory,
      experienceDates,
      dragging,
      trip,
      startDate,
      endDate,
      showDetails,
    } = this.state;

    const experiences = this.getFilteredExperiences();

    const totalGuests = (
      (trip.passengers.adults ?? 0)
      + (trip.passengers.children ?? 0)
      + (trip.passengers.infants ?? 0)
    );

    return (
      <div className={css.Experiences}>
        <div className={css.Header}>
          <h1>Add experiences</h1>

          <img src={rafflesIcon} alt="Experiences" />

          <h2>
            To add experiences, drag and drop them into the relevant day in the column on the right.
          </h2>
        </div>

        {!experiences
          ? (
            <div className={css.Loading}>
              <img src={spinnerIcon} alt="Loading" />
              Fetching experiences.
            </div>
          )
          : (
            <>
              {showDetails && (
                <ExperienceInfoModal
                  experience={showDetails}
                  onClose={(): void => this.toggleDetails(undefined)}
                />
              )}

              <div className={css.Categories}>
                {Object.keys(ExperienceCategoryEnum).map((category, idx) => {
                  let categoryLabel;

                  switch (category) {
                    case ExperienceCategoryEnum.all:
                      categoryLabel = 'All experiences';
                      break;
                    case ExperienceCategoryEnum.main:
                      categoryLabel = 'Main attractions';
                      break;
                    case ExperienceCategoryEnum.spa:
                      categoryLabel = 'Spas';
                      break;
                    case ExperienceCategoryEnum.adventure:
                      categoryLabel = 'Adventure';
                      break;
                    case ExperienceCategoryEnum.museum:
                      categoryLabel = 'Museums';
                      break;
                    default:
                      break;
                  }

                  return (
                    <button
                      key={`category-${idx}`}
                      type="button"
                      onClick={(): void => this.onSelectCategory(
                        ExperienceCategoryEnum[category as keyof typeof ExperienceCategoryEnum],
                      )}
                      className={selectedCategory === category ? css.Selected : undefined}
                    >
                      {categoryLabel}
                    </button>
                  );
                })}
              </div>

              <div className={css.SelectionArea}>
                <div className={css.ExperienceList}>
                  {experiences.length === 0
                    ? (
                      <div>
                        No experiences found.
                      </div>
                    )
                    : experiences.map((experience, idx) => (
                      <Experience
                        onDragStart={(): void => this.setState({ dragging: 'experience' })}
                        onDragEnd={(): void => this.setState({ dragging: undefined })}
                        data={experience}
                        key={`experience-${idx}`}
                        className={css.Experience}
                        onShowDetails={(nextExperience): void => this.toggleDetails(nextExperience)}
                      />
                    ))}
                </div>

                <div className={css.Schedule}>
                  <h1>Create your own Stopover schedule</h1>
                  <h2>
                    {`From ${
                      startDate.toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })
                    } to ${
                      endDate.toLocaleDateString('en-GB', { month: 'long', day: 'numeric' })
                    }`}
                  </h2>

                  <div className={css.ExperienceDates}>
                    {experienceDates.map((experienceDate, idx) => (
                      <div className={css.ExperienceDate} key={`day-${idx}`}>
                        <h3>
                          {experienceDate.date.toLocaleDateString(
                            'en-GB',
                            { month: 'long', day: 'numeric' },
                          )}
                        </h3>

                        <div
                          className={`${css.SelectedExperiences} ${
                            experienceDate.experiences.length === 0
                              ? css.ShowDropHint
                              : ''
                          }`}
                          onDrop={(e): void => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (dragging === 'experience') {
                              this.onDropExperience(experienceDate, e);
                            } else {
                              this.onDropSelectedExperience(experienceDate, e);
                            }
                          }}
                          onDragOver={this.onDragOver}
                          onDragLeave={this.onDragLeave}
                          onDragEnter={this.onDragEnter}
                        >
                          {experienceDate.experiences.map((exp, itemIdx) => {
                            const { experience } = exp;

                            const timeSlots = experience.availability.filter(
                              (avail) => avail.start.toLocaleDateString('sv-SE')
                                === experienceDate.date.toLocaleDateString('sv-SE'),
                            );

                            return (
                              <SelectedExperience
                                className={css.SelectedExperience}
                                data={exp}
                                onSelectTimeSlot={(date): void => {
                                  this.selectTimeSlot(experience, date);
                                }}
                                guests={totalGuests}
                                timeSlots={timeSlots}
                                key={`experience-${itemIdx}`}
                                onRemove={(): void => this.onRemove(experience)}
                              />
                            );
                          })}

                          <span className={css.DropHint}>
                            Drag and drop experiences here to add
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

      </div>
    );
  }
}
