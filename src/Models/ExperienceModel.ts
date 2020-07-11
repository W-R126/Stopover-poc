import { ExperienceCategoryEnum } from '../Enums/ExperienceCategoryEnum';

export interface TimeSlotModel {
  date: Date;
  all: Date[];
  available: Date[];
}

export interface ExperienceModel {
  id: number;
  title: string;
  location: string;
  prices: {
    adult: number;
    child: number;
    infant: number;
  };
  categories: ExperienceCategoryEnum[];
  currency: string;
  timeSlots?: TimeSlotModel[];
  opens: Date;
  closes: Date;
  recommended: boolean;
  duration?: number;
  image?: {
    url: string;
    alt: string;
  };
}
