import CityImage1 from '../../Assets/Images/Experimental/CityImage1.jpg';
import CityImage2 from '../../Assets/Images/Experimental/CityImage2.jpg';
import CityImage3 from '../../Assets/Images/Experimental/CityImage3.jpg';
import CityImage4 from '../../Assets/Images/Experimental/CityImage4.jpg';

export interface DatePriceModel {
  date: Date; price: number;
}

export const SearchInputData = [
  {
    title: 'Book a flight from London to Beirut',
    iconType: 0,
    content: {
      type: 0,
      dateRange: {
        start: new Date('2020-10-7'),
        end: new Date('2020-10-14'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'BEY',
        Depature: 'LHR',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
      datePrice: [],
    },
  },
  {
    title: 'Book a flight from London to Colombo',
    iconType: 1,
    content: {
      type: 0,
      dateRange: {
        start: new Date('2020-10-7'),
        end: new Date('2020-10-14'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'CMB',
        Depature: 'LHR',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
      datePrice: [],
    },
  },
  {
    title: 'Book a flight from London to Muscat',
    iconType: 1,
    content: {
      type: 0,
      dateRange: {
        start: new Date('2020-10-7'),
        end: new Date('2020-10-14'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'MCT',
        Depature: 'LHR',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
      datePrice: [],
    },
  },
  {
    title: 'Book a flight from London to Sydney',
    iconType: 2,
    content: {
      type: 0,
      dateRange: {
        start: new Date('2020-10-7'),
        end: new Date('2020-10-14'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'SYD',
        Depature: 'LHR',
        Stops: 1,
        Duration: '24hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
      DatePrice: [
        { date: new Date('2020-10-5'), price: 800 },
        { date: new Date('2020-10-6'), price: 800 },
        { date: new Date('2020-10-7'), price: 800 },
        { date: new Date('2020-10-8'), price: 920 },
        { date: new Date('2020-10-9'), price: 920 },
        { date: new Date('2020-10-10'), price: 675 },
        { date: new Date('2020-10-11'), price: 800 },
        { date: new Date('2020-10-12'), price: 920 },
        { date: new Date('2020-10-13'), price: 800 },
        { date: new Date('2020-10-14'), price: 800 },
        { date: new Date('2020-10-15'), price: 920 },
        { date: new Date('2020-10-16'), price: 920 },
        { date: new Date('2020-10-17'), price: 675 },
        { date: new Date('2020-10-18'), price: 800 },
        { date: new Date('2020-10-19'), price: 920 },
        { date: new Date('2020-10-20'), price: 920 },
        { date: new Date('2020-10-21'), price: 920 },
        { date: new Date('2020-10-22'), price: 920 },
        { date: new Date('2020-10-23'), price: 920 },
        { date: new Date('2020-10-24'), price: 675 },
        { date: new Date('2020-10-25'), price: 800 },
        { date: new Date('2020-10-26'), price: 800 },
        { date: new Date('2020-10-27'), price: 800 },
        { date: new Date('2020-10-28'), price: 800 },
        { date: new Date('2020-10-29'), price: 920 },
        { date: new Date('2020-10-30'), price: 920 },
        { date: new Date('2020-10-31'), price: 675 },
      ],
    },
  },
  {
    title: 'Book a flight from London to Mumbai',
    iconType: 2,
    content: {
      type: 0,
      dateRange: {
        start: new Date('2020-10-7'),
        end: new Date('2020-10-14'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'BOM',
        Depature: 'LHR',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
      datePrice: [],
    },
  },
  {
    title: 'Book a flight from London to New York',
    iconType: 2,
    content: {
      type: 0,
      dateRange: {
        start: new Date('2020-10-7'),
        end: new Date('2020-10-14'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'EWR',
        Depature: 'LHR',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
      datePrice: [],
    },
  },
  {
    title: 'Book a flight from London to Berlin',
    iconType: 2,
    content: {
      type: 0,
      dateRange: {
        start: new Date('2020-10-7'),
        end: new Date('2020-10-14'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'TXL',
        Depature: 'LHR',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
      datePrice: [],
    },
  },
  {
    title: 'How much baggage allowance for Economy flex ticket to Abu Dhabi',
    iconType: 2,
    content: {
      type: 2,
      weight: 35,
      answer: 'Baggage allowance for Economy Flex is',
    },
  },
  {
    title: 'How much baggage is allowed for domestic flights',
    iconType: 2,
    content: {
      type: 2,
      weight: 35,
      answer: 'Baggage allowance for Domestic flights is',
    },
  },
  {
    title: 'How much is the baggage allowance on business class',
    iconType: 2,
    content: {
      type: 2,
      weight: 35,
      answer: 'Baggage allowance for Business class is',

    },
  },
  {
    title: 'Where can I go with my budget',
    iconType: 2,
    content: {
      type: 3,
      budget: 1500,
    },
  },
  {
    title: 'Where can I go today',
    iconType: 2,
    content: {
      type: 3,
      budget: 1500,
    },
  },
  {
    title: 'Where can I go for covid testing',
    iconType: 2,
    content: {
      type: 3,
      budget: 1500,
    },
  },
];

export const getCityImage = (cityCode: string): string => {
  const imgArray = [CityImage1, CityImage2, CityImage3, CityImage4];
  const nIndex = Math.floor(Math.random() * 10) % 4;
  return imgArray[nIndex];
};

export const getCityPrice = (cityCode: string): number => Math.floor(Math.random() * 100);
