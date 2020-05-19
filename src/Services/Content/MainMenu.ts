import searchIcon from '../../Assets/Images/UI/search-icon.svg';
import accountIcon from '../../Assets/Images/UI/account.svg';
import journeyBook from '../../Assets/Images/UI/journey-book.webp';
import carRental from '../../Assets/Images/UI/car-rental.svg';
import onBoard from '../../Assets/Images/UI/onboard.svg';
import lounge from '../../Assets/Images/UI/lounge.svg';
import checkInArea from '../../Assets/Images/UI/check-in-area.svg';
import manageYourBooking from '../../Assets/Images/UI/manage-your-booking.svg';
import ancillarySeat from '../../Assets/Images/UI/ancillary-seat.svg';
import abuDhabi from '../../Assets/Images/UI/abu-dhabi.svg';
import ticketReservation from '../../Assets/Images/UI/ticket-reservation.svg';
import checkedBaggage from '../../Assets/Images/UI/checked-baggage.svg';
import contactUs from '../../Assets/Images/UI/contact-us.svg';

export default [
  {
    title: 'Book',
    url: '/en/book',
    categories: [
      {
        title: 'Your trip',
        image: { url: journeyBook, alt: 'Your trip' },
        links: [
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
        image: { url: carRental, alt: 'Your trip' },
        links: [
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
    categories: [
      {
        title: 'On board',
        image: { url: onBoard, alt: 'On board' },
        links: [
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
        image: { url: lounge, alt: 'Before you fly' },
        links: [
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
    categories: [
      {
        title: 'Check in',
        image: { url: checkInArea, alt: 'Check in' },
        links: [
          { title: 'Check in online', url: '/en/manage/check-in' },
        ],
      },
      {
        title: 'Manage your booking',
        image: { url: manageYourBooking, alt: 'Manage your booking' },
        links: [
          { title: 'View or change booking', url: '/en/manage' },
          { title: 'Flight status', url: '/en/manage/flight-tracker' },
          { title: 'Flight timetable', url: '/en/manage/flight-timetable' },
          { title: 'Special assistance', url: '/en/manage/special-assistance' },
          { title: 'Choose your seat', url: '/en/fly-etihad/our-cabins/economy-class/choose-your-seat' },
        ],
      },
      {
        title: 'Upgrades and extras',
        image: { url: ancillarySeat, alt: 'Upgrades and extras' },
        links: [
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
    categories: [
      {
        title: 'Abu Dhabi',
        image: { url: abuDhabi, alt: 'Abu Dhabi' },
        links: [
          { title: 'Discover Abu Dhabi', url: '/en/destinations/abu-dhabi' },
          { title: 'Stop over in Abu Dhabi', url: '/en/destinations/abu-dhabi/stopover' },
          { title: 'Abu Dhabi discounts', url: '/en/destinations/abu-dhabi/discounts' },
          { title: 'Formula 1™', url: '/en/destinations/abu-dhabi/formula-1' },
        ],
      },
      {
        title: 'Flights',
        image: { url: ticketReservation, alt: 'Flights' },
        links: [
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
    categories: [
      {
        title: 'Baggage',
        image: { url: checkedBaggage, alt: 'Baggage' },
        links: [
          { title: 'Delayed or damaged baggage', url: '/en/help/delayed-baggage' },
          { title: 'Baggage guide', url: '/en/fly-etihad/baggage' },
          { title: 'Lost and found', url: '/en/help/lost-and-found' },
        ],
      },
      {
        title: 'Get in touch',
        image: { url: contactUs, alt: 'Get in touch' },
        links: [
          { title: 'COVID-19 travel updates', url: '/en/travel-updates/covid-19' },
          { title: 'Talk to us', url: '/en/help/contact-us' },
          { title: 'Feedback', url: '/en/help/feedback' },
          { title: 'Our mobile apps', url: '/en/help/mobile-apps' },
        ],
      },
      {
        title: 'Your booking',
        image: { url: ticketReservation, alt: 'Your booking' },
        links: [
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
  {
    image: { url: searchIcon, alt: 'Search' },
    url: '/en/search',
  },
  {
    image: { url: accountIcon, alt: 'Account' },
    url: 'https://www.etihadguest.com/en/login-standalone.html',
    external: true,
  },
];
