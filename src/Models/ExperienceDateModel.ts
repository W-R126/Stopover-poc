import { ExperienceModel } from './ExperienceModelNew';

export interface ExperienceDateModel {
  date: Date;
  experiences: {
    selectedTimeSlot: Date;
    guests: number;
    experience: ExperienceModel;
  }[];
}
