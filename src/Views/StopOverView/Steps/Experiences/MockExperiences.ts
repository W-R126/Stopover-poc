import golf from '../../../../Assets/Mocks/golf.png';
import louvre from '../../../../Assets/Mocks/louvre.png';
import waterworld from '../../../../Assets/Mocks/waterworld.png';
import ferrariworld from '../../../../Assets/Mocks/ferrariworld.png';
import { ExperienceCategoryEnum } from '../../../../Enums/ExperienceCategoryEnum';

export default [
  {
    id: 1,
    title: 'Saadiyat Golf Club',
    location: 'Saadiyat Island, Abu Dhabi',
    prices: {
      adult: 340,
      child: 340,
      infant: 0,
    },
    currency: 'AED',
    recommended: true,
    timeSlots: [
      {
        date: new Date(2020, 7, 5),
        all: [
          new Date(2020, 0, 1, 6, 0, 0),
          new Date(2020, 0, 1, 9, 0, 0),
          new Date(2020, 0, 1, 12, 0, 0),
          new Date(2020, 0, 1, 15, 0, 0),
          new Date(2020, 0, 1, 18, 0, 0),
        ],
        available: [
          new Date(2020, 0, 1, 6, 0, 0),
          new Date(2020, 0, 1, 9, 0, 0),
          new Date(2020, 0, 1, 15, 0, 0),
          new Date(2020, 0, 1, 18, 0, 0),
        ],
      },
      {
        date: new Date(2020, 7, 6),
        all: [
          new Date(2020, 0, 1, 6, 0, 0),
          new Date(2020, 0, 1, 9, 0, 0),
          new Date(2020, 0, 1, 12, 0, 0),
          new Date(2020, 0, 1, 15, 0, 0),
          new Date(2020, 0, 1, 18, 0, 0),
        ],
        available: [],
      },
      {
        date: new Date(2020, 7, 7),
        all: [
          new Date(2020, 0, 1, 6, 0, 0),
          new Date(2020, 0, 1, 9, 0, 0),
          new Date(2020, 0, 1, 12, 0, 0),
          new Date(2020, 0, 1, 15, 0, 0),
          new Date(2020, 0, 1, 18, 0, 0),
        ],
        available: [
          new Date(2020, 0, 1, 9, 0, 0),
          new Date(2020, 0, 1, 12, 0, 0),
        ],
      },
    ],
    opens: new Date(2020, 0, 1, 6, 0, 0),
    closes: new Date(2020, 0, 1, 21, 0, 0),
    duration: 180,
    image: {
      url: golf,
      alt: 'Saadiyat Golf Club',
    },
    categories: [
      ExperienceCategoryEnum.main,
    ],
  },
  {
    id: 2,
    title: 'Louvre Abu Dhabi',
    location: 'Saadiyat Island, Abu Dhabi',
    prices: {
      adult: 60,
      child: 30,
      infant: 0,
    },
    currency: 'AED',
    recommended: true,
    opens: new Date(2020, 0, 1, 9, 0, 0),
    closes: new Date(2020, 0, 1, 19, 0, 0),
    image: {
      url: louvre,
      alt: 'Louvre Abu Dhabi',
    },
    categories: [
      ExperienceCategoryEnum.museum,
    ],
  },
  {
    id: 3,
    title: 'Yas Waterworld',
    location: 'Yas Island',
    prices: {
      adult: 120,
      child: 60,
      infant: 0,
    },
    currency: 'AED',
    recommended: true,
    opens: new Date(2020, 0, 1, 9, 0, 0),
    closes: new Date(2020, 0, 1, 19, 0, 0),
    image: {
      url: waterworld,
      alt: 'Yas Waterworld',
    },
    categories: [
      ExperienceCategoryEnum.adventure,
    ],
  },
  {
    id: 4,
    title: 'Ferrari World Abu Dhabi',
    location: 'Yas Island',
    prices: {
      adult: 320,
      child: 120,
      infant: 0,
    },
    currency: 'AED',
    recommended: false,
    opens: new Date(2020, 0, 1, 9, 0, 0),
    closes: new Date(2020, 0, 1, 19, 0, 0),
    image: {
      url: ferrariworld,
      alt: 'Ferrari World Abu Dhabi',
    },
    categories: [
      ExperienceCategoryEnum.adventure,
    ],
  },
];
