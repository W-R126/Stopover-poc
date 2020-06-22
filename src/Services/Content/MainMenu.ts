import plane from '../../Assets/Images/plane.webp';
import car from '../../Assets/Images/car.svg';
import seat from '../../Assets/Images/seat.svg';
import lounge from '../../Assets/Images/lounge.svg';
import checkIn from '../../Assets/Images/check-in.svg';
import flightSettings from '../../Assets/Images/flight-settings.svg';
import seatUpgrade from '../../Assets/Images/seat-upgrade.svg';
import abuDhabi from '../../Assets/Images/abu-dhabi.svg';
import tickets from '../../Assets/Images/tickets.svg';
import baggage from '../../Assets/Images/baggage.svg';
import contact from '../../Assets/Images/contact.svg';

export default [
  {
    title: 'Book',
    url: '/en/book',
    subMenu: [
      {
        title: 'Your trip',
        imageUrl: plane,
        subMenu: [
          { title: 'Book flights', url: '/en/book' },
          { title: 'Book groups', url: '/en/book/group-bookings' },
          { title: 'Book a stop over in Abu Dhabi', url: '/en/destinations/abu-dhabi/stopover' },
          { title: 'Book with Etihad Guest Miles', url: '/en/book/book-with-etihad-guest-miles' },
          { title: 'Book Rail & Fly', url: '/en/book/rail-and-fly' },
          { title: 'Unaccompanied minors', url: '/en/manage/special-assistance/unaccompanied-minors' },
          { title: 'Global Meet & Assist', url: '/en/book/meet-and-greet' },
          { title: 'Need a UAE visa?', url: '/en/fly-etihad/visas' },
        ],
      },
      {
        title: 'Your transfer',
        imageUrl: car,
        subMenu: [
          { title: 'To and from the airport', url: '/en/book/airport-transfers' },
          { title: 'Book Etihad Chauffeur', url: '/en/book/airport-transfers/etihad-chauffeur' },
          { title: 'Book Etihad Coach', url: '/en/book/airport-transfers/etihad-coach' },
          { title: 'Rent a car', url: 'https://www.etihadholidays.com/en-ae/#carRental', external: true },
        ],
      },
    ],
  },
  {
    title: 'Fly Etihad',
    url: '/en/fly-etihad',
    subMenu: [
      {
        title: 'On board',
        imageUrl: seat,
        subMenu: [
          { title: 'Our cabins', url: '/en/fly-etihad/our-cabins' },
          { title: 'Meals on board', url: '/en/fly-etihad/food-and-drink' },
          { title: 'Flying with children', url: '/en/fly-etihad/flying-with-children' },
          { title: 'Entertainment and Wi-Fi', url: '/en/fly-etihad/in-flight-entertainment' },
          { title: 'Our fleet', url: '/en/fly-etihad/our-fleet' },
          { title: 'Seat choices', url: '/en/fly-etihad/our-cabins/economy-class/choose-your-seat' },
        ],
      },
      {
        title: 'Before you fly',
        imageUrl: lounge,
        subMenu: [
          { title: 'Lounges', url: '/en/fly-etihad/lounges' },
          { title: 'Need a UAE visa?', url: '/en/fly-etihad/visas' },
          { title: 'Airport information', url: '/en/fly-etihad/airport-information' },
          { title: 'Baggage allowance', url: '/en/fly-etihad/baggage' },
          { title: 'Loyalty programme', url: 'https://www.etihadguest.com/', external: true },
          { title: 'Special assistance', url: '/en/manage/special-assistance' },
          { title: 'Travel insurance', url: '/en/fly-etihad/travel-insurance' },
          { title: 'Clear US immigration', url: '/en/fly-etihad/us-immigration-in-abu-dhabi' },
        ],
      },
    ],
  },
  {
    title: 'Manage',
    url: '/en/manage',
    subMenu: [
      {
        title: 'Check in',
        imageUrl: checkIn,
        subMenu: [
          { title: 'Check in online', url: '/en/manage/check-in' },
        ],
      },
      {
        title: 'Manage your booking',
        imageUrl: flightSettings,
        subMenu: [
          { title: 'View or change booking', url: '/en/manage' },
          { title: 'Flight status', url: '/en/manage/flight-tracker' },
          { title: 'Flight timetable', url: '/en/manage/flight-timetable' },
          { title: 'Special assistance', url: '/en/manage/special-assistance' },
          { title: 'Choose your seat', url: '/en/fly-etihad/our-cabins/economy-class/choose-your-seat' },
        ],
      },
      {
        title: 'Upgrades and extras',
        imageUrl: seatUpgrade,
        subMenu: [
          { title: 'Upgrade', url: '/en/manage/upgrade' },
          { title: 'Duty Free', url: '/en/manage/duty-free' },
          { title: 'Extra baggage', url: '/en/fly-etihad/baggage/excess' },
          { title: 'Choose your seat', url: '/en/fly-etihad/our-cabins/economy-class/choose-your-seat' },
          { title: 'Special assistance', url: '/en/manage/special-assistance' },
          { title: 'Global Meet & Assist', url: '/en/book/meet-and-greet' },
          { title: 'Travel insurance', url: '/en/fly-etihad/travel-insurance' },
          { title: 'To and from the airport', url: '/en/book/airport-transfers' },
        ],
      },
    ],
  },
  {
    title: 'Destinations',
    url: '/en/destinations',
    subMenu: [
      {
        title: 'Abu Dhabi',
        imageUrl: abuDhabi,
        subMenu: [
          { title: 'Discover Abu Dhabi', url: '/en/abu-dhabi' },
          { title: 'Stop over in Abu Dhabi', url: '/en/abu-dhabi/stopover' },
          { title: 'Abu Dhabi discounts', url: '/en/abu-dhabi/discounts' },
          { title: 'Formula 1™', url: '/en/abu-dhabi/formula-1' },
        ],
      },
      {
        title: 'Flights',
        imageUrl: tickets,
        subMenu: [
          { title: 'Where we fly', url: 'https://flights.etihad.com/routemap/', external: true },
          { title: 'Flights to Abu Dhabi', url: 'https://flights.etihad.com/en/flights-to-abu-dhabi', external: true },
          { title: 'Flight offers', url: '/en/book/special-offers' },
        ],
      },
    ],
  },
  {
    title: 'Help',
    url: '/en/help',
    subMenu: [
      {
        title: 'Baggage',
        imageUrl: baggage,
        subMenu: [
          { title: 'Delayed or damaged baggage', url: '/en/help/delayed-baggage' },
          { title: 'Baggage guide', url: '/en/fly-etihad/baggage' },
          { title: 'Lost and found', url: '/en/help/lost-and-found' },
        ],
      },
      {
        title: 'Get in touch',
        imageUrl: contact,
        subMenu: [
          { title: 'COVID-19 travel updates', url: '/en/travel-updates/covid-19' },
          { title: 'Talk to us', url: '/en/help/contact-us' },
          { title: 'Feedback', url: '/en/help/feedback' },
          { title: 'Our mobile apps', url: '/en/help/mobile-apps' },
        ],
      },
      {
        title: 'Your booking',
        imageUrl: tickets,
        subMenu: [
          { title: 'Change my booking', url: '/en/manage' },
          { title: 'Ways to pay', url: '/en/book/payment-options' },
          { title: 'Travelling with children', url: '/en/fly-etihad/flying-with-children' },
          { title: 'Special assistance', url: '/en/manage/special-assistance' },
          { title: 'Travel Bank', url: '/en/help/travel-bank' },
        ],
      },
    ],
  },
  {
    title: 'Etihad Guest',
    url: 'https://www.etihadguest.com/',
    external: true,
  },
];
