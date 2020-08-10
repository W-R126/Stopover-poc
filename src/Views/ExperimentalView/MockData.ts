export const SearchInputData = [
  {
    title: 'Book a flight from London to Beirut',
    content: {
      type: 0,
      dateRange: {
        start: new Date('2020-09-12'),
        end: new Date('2020-09-20'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'RUH',
        Depature: 'AUH',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
    },
  },
  {
    title: 'Book a flight from Colombo to London',
    content: {
      type: 1,
      dateRange: {
        start: new Date('2020-08-19'),
        end: new Date('2020-08-21'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'RUH',
        Depature: 'AUH',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
    },
  },
  {
    title: 'Book a flight from Sydney to Muscat',
    content: {
      type: 1,
      dateRange: {
        start: new Date('2020-08-29'),
        end: new Date('2020-09-15'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'RUH',
        Depature: 'AUH',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
    },
  },
  {
    title: 'Book a flight from London to Sydney',
    content: {
      type: 1,
      dateRange: {
        start: new Date('2020-10-10'),
        end: new Date('2020-10-21'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'RUH',
        Depature: 'AUH',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
    },
  },
  {
    title: 'Book a flight from London to Mumbai',
    content: {
      type: 1,
      dateRange: {
        start: new Date(),
        end: new Date('2020-08-11'),
      },
      passenger: {
        adults: 1,
        children: 0,
        infants: 0,
      },
      segment: [{
        Arrival: 'RUH',
        Depature: 'AUH',
        Stops: 1,
        Duration: '10hr Travel Time',
      }],
      Description: "This flight has a layover in Abu Dhabi! It's eligible for Etihad's amazing Stopover Abu Dhabi deals",
    },
  },
  {
    title: 'How much baggage allowance for Economy flex ticke',
    content: {
      type: 2,
      weight: 25,
    },
  },
  {
    title: 'How much baggage is allowed for domestic flights',
    content: {
      type: 2,
      weight: 35,
    },
  },
  {
    title: 'Where can I go with my budget',
    content: {
      type: 3,
      budget: 1500,
    },
  },
];
