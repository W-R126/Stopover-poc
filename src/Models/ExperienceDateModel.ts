import { ExperienceModel } from './ExperienceModel';

export interface ExperienceDateModel {
  date: Date;
  experiences: {
    selectedTimeSlot: Date;
    guests: number;
    experience: ExperienceModel;
  }[];
}
