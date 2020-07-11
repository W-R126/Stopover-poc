import React from 'react';

import css from './Experiences.module.css';
import rafflesIcon from '../../../../Assets/Images/raffles.svg';
import spinnerIcon from '../../../../Assets/Images/spinner.svg';
import { ExperienceModel } from '../../../../Models/ExperienceModel';
import Experience from './Components/Experience';
import MockExperiences from './MockExperiences';
import { ExperienceCategoryEnum } from '../../../../Enums/ExperienceCategoryEnum';
import Utils from '../../../../Utils';
import SelectedExperience from './Components/SelectedExperience';

type ExperienceDate = {
  date: Date;
  experiences: ExperienceModel[];
}

interface ExperiencesProps {
  startDate: Date;
  endDate: Date;
}

interface ExperiencesState {
  selectedCategory: ExperienceCategoryEnum;
  experiences?: ExperienceModel[];
  experienceDates: ExperienceDate[];
  dragging?: 'experience' | 'selectedExperience';
}

export default class Experiences extends React.Component<ExperiencesProps, ExperiencesState> {
  constructor(props: ExperiencesProps) {
    super(props);

    this.state = {
      selectedCategory: ExperienceCategoryEnum.all,
      experiences: undefined,
      experienceDates: [],
      dragging: undefined,
    };

    this.onDropExperience = this.onDropExperience.bind(this);
  }

  componentDidMount(): void {
    const { startDate, endDate } = this.props;

    const experienceDates: ExperienceDate[] = [];
    const daysDelta = Utils.getDaysDelta(startDate, endDate);

    for (let i = 0; i <= daysDelta; i += 1) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);

      experienceDates.push({ date, experiences: [] });
    }

    this.setState({
      experiences: MockExperiences,
      experienceDates,
    });
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
    experienceDate: ExperienceDate,
    e: React.DragEvent<HTMLDivElement>,
  ): void {
    const { experiences } = this.state;
    const target = e.target as HTMLDivElement;

    target.classList.remove(css.Hover);

    if (!experiences) {
      return;
    }

    const id = Number.parseInt(e.dataTransfer.getData('text/plain'), 10);
    const experience = experiences.find((item) => item.id === id);

    if (experience) {
      experienceDate.experiences.push(experience);
    }

    this.setState({ dragging: undefined });
  }

  private onDropSelectedExperience(
    experienceDate: ExperienceDate,
    e: React.DragEvent<HTMLDivElement>,
  ): void {
    const { experiences } = this.state;

    if (!experiences) {
      return;
    }

    const id = Number.parseInt(e.dataTransfer.getData('text/plain'), 10);
    const experience = experiences.find((item) => item.id === id);

    if (experience) {
      const { experienceDates } = this.state;

      experienceDates.forEach((item) => {
        const idx = item.experiences.indexOf(experience);

        if (idx !== -1) {
          item.experiences.splice(idx, 1);
        }
      });

      experienceDate.experiences.push(experience);
    }

    this.setState({ dragging: undefined });
  }

  private onRemove(experience: ExperienceModel): void {
    const { experienceDates } = this.state;

    const experienceDate = experienceDates.find(
      (ed) => ed.experiences.indexOf(experience) !== -1,
    );

    if (experienceDate) {
      experienceDate.experiences.splice(experienceDate.experiences.indexOf(experience), 1);
    }

    this.forceUpdate();
  }

  private getFilteredExperiences(): ExperienceModel[] | undefined {
    const { experiences, selectedCategory, experienceDates } = this.state;

    if (!experiences) {
      return undefined;
    }

    const selectedExperiences = experienceDates.reduce(
      (prev, curr) => prev.concat(curr.experiences),
      ([] as ExperienceModel[]),
    );

    let finalExperiences = experiences;

    if (selectedCategory !== ExperienceCategoryEnum.all) {
      finalExperiences = experiences.filter(
        (experience) => experience.categories.indexOf(selectedCategory) !== -1,
      );
    }

    return finalExperiences.filter((experience) => selectedExperiences.indexOf(experience) === -1);
  }

  render(): JSX.Element {
    const { selectedCategory, experienceDates, dragging } = this.state;
    const { startDate, endDate } = this.props;

    const experiences = this.getFilteredExperiences()?.sort((a, b) => {
      if (a.recommended && b.recommended) {
        return 0;
      }

      return a.recommended ? -1 : 1;
    });

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
                        category as ExperienceCategoryEnum,
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
                            dragging || experienceDate.experiences.length === 0
                              ? css.ShowDropHint
                              : ''
                          }`}
                          onDrop={dragging === 'experience'
                            ? (e): void => this.onDropExperience(experienceDate, e)
                            : (e): void => this.onDropSelectedExperience(experienceDate, e)}
                          onDragOver={this.onDragOver}
                          onDragLeave={this.onDragLeave}
                          onDragEnter={this.onDragEnter}
                        >
                          {experienceDate.experiences.map((experience, itemIdx) => {
                            const timeSlots = (experience.timeSlots ?? []).find(
                              (timeSlot) => timeSlot.date.toLocaleDateString('sv-SE')
                                === experienceDate.date.toLocaleDateString('sv-SE'),
                            );

                            return (
                              <SelectedExperience
                                className={css.SelectedExperience}
                                data={experience}
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
