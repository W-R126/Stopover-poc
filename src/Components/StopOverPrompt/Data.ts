import stRegis from '../../Assets/Images/StopOver/st-regis.jpg';
import yasWaterworld from '../../Assets/Images/StopOver/yas-waterworld.jpg';
import warnerBros from '../../Assets/Images/StopOver/warner-bros-world.png';
import family from '../../Assets/Images/StopOver/family-leisure.webp';

import anantaraSpa from '../../Assets/Images/StopOver/anantara-spa.webp';
import beachGolf from '../../Assets/Images/StopOver/beach-golf.jpg';
import palaceHotel from '../../Assets/Images/StopOver/palace-hotel.jpg';
import businessTraveller from '../../Assets/Images/StopOver/business-traveller.jpg';

import beachClub from '../../Assets/Images/StopOver/beach-club.jpg';
import kayakTour from '../../Assets/Images/StopOver/kayak-tour.jpg';
import wAbuDhabi from '../../Assets/Images/StopOver/w-abu-dhabi.jpg';
import leisure from '../../Assets/Images/StopOver/couple-leisure.jpg';

const Data: {
  [key: string ]: {
    imageUrl: string;
    offers: {
      imageUrl: string;
      currency: string;
      price: number;
      title: string;
      description: string;
    }[];
  };
} = {
  Family: {
    imageUrl: family,
    offers: [
      {
        imageUrl: stRegis,
        currency: 'EUR',
        price: 440,
        title: 'The St. Regis Saadiyat Island',
        description: '2 nights from',
      },
      {
        imageUrl: yasWaterworld,
        currency: 'EUR',
        price: 150,
        title: 'Yas Waterworld',
        description: 'Family entrance from',
      },
      {
        imageUrl: warnerBros,
        currency: 'EUR',
        price: 170,
        title: 'Warner Bros World',
        description: 'Family entrance from',
      },
    ],
  },
  Leisure: {
    imageUrl: leisure,
    offers: [
      {
        imageUrl: wAbuDhabi,
        currency: 'EUR',
        price: 520,
        title: 'W Abu Dhabi',
        description: '2 nights from',
      },
      {
        imageUrl: kayakTour,
        currency: 'EUR',
        price: 80,
        title: 'Mangroves Kayak Tour',
        description: '2 hour tour/couple',
      },
      {
        imageUrl: beachClub,
        currency: 'EUR',
        price: 160,
        title: 'Saadiyat Beach Club',
        description: 'Daily entrance/couple',
      },
    ],
  },
  Business: {
    imageUrl: businessTraveller,
    offers: [
      {
        imageUrl: palaceHotel,
        currency: 'EUR',
        price: 740,
        title: 'Emirates Palace Hotel',
        description: '2 nights from',
      },
      {
        imageUrl: beachGolf,
        currency: 'EUR',
        price: 150,
        title: 'Saadiyat Beach Golf Club',
        description: '1 day entrance from',
      },
      {
        imageUrl: anantaraSpa,
        currency: 'EUR',
        price: 160,
        title: 'Anantara Spa',
        description: 'Muscle reviver massage from',
      },
    ],
  },
};

export default Data;
