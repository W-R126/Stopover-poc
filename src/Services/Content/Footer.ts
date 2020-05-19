import linkedIn from '../../Assets/Images/SocialMedia/linkedin-icon.svg';
import facebook from '../../Assets/Images/SocialMedia/facebook-icon.svg';
import instagram from '../../Assets/Images/SocialMedia/instagram-icon.svg';
import youTube from '../../Assets/Images/SocialMedia/youtube-icon.svg';
import twitter from '../../Assets/Images/SocialMedia/twitter-icon.svg';
import abuDhabi from '../../Assets/Images/Logos/abu-dhabi-to-the-world.svg';

export default {
  linkGroups: [
    {
      title: 'About Etihad Airways',
      links: [
        { title: 'Corporate profile', url: '/en/corporate-profile' },
        { title: 'Latest news', url: '/en/news' },
        { title: 'Careers', url: 'https://careers.etihad.com/', external: true },
        { title: 'Our sponsorships', url: '/en/corporate-profile/our-sponsorship' },
        { title: 'Our codeshare partner airlines', url: '/en/fly-etihad/our-partners' },
        { title: 'Ethics and compliance', url: '/en/corporate-profile/ethics-and-compliance' },
        { title: 'Innovation', url: '/en/corporate-profile/innovation' },
        { title: 'Sustainability', url: 'https://www.etihadaviationgroup.com/en-ae/home-corporate/about/sustainability.html', external: true },
      ],
    },
    {
      title: 'About Etihad Aviation Group',
      links: [
        { title: 'Etihad Aviation Group', url: 'https://www.etihadaviationgroup.com/', external: true },
        { title: 'Etihad Guest', url: 'https://www.etihadguest.com/', external: true },
        { title: 'Etihad Cargo', url: 'https://www.etihadcargo.com/', external: true },
        { title: 'Etihad Engineering', url: 'https://www.etihadengineering.com/', external: true },
        { title: 'Etihad Aviation Training', url: 'https://www.etihadaviationtraining.com/', external: true },
        { title: 'Etihad Holidays', url: 'https://www.etihadholidays.com/', external: true },
        { title: 'Etihad Business Connect', url: 'https://www.etihadbusinessconnect.com/', external: true },
        { title: 'Etihad Secure Logistics', url: 'https://www.etihadsecurelogistics.com/en-ae/', external: true },
      ],
    },
    {
      title: 'Useful links',
      links: [
        { title: 'COVID-19 travel updates', url: '/en/travel-updates/covid-19' },
        { title: 'Your travel choices', url: '/en/fly-etihad/your-travel-choices' },
        { title: 'Baggage', url: '/en/fly-etihad/baggage' },
        { title: 'Payment options', url: '/en/book/payment-options' },
        { title: 'Our mobile apps', url: '/en/help/mobile-apps' },
      ],
    },
  ],
  socialMediaLinks: [
    {
      image: { url: linkedIn, alt: 'LinkedIn' },
      url: 'http://www.linkedin.com/company/etihadairways',
      external: true,
    },
    {
      image: { url: facebook, alt: 'Facebook' },
      url: 'http://www.facebook.com/etihad',
      external: true,
    },
    {
      image: { url: instagram, alt: 'Instagram' },
      url: 'https://www.instagram.com/etihadairways/',
      external: true,
    },
    {
      image: { url: youTube, alt: 'YouTube' },
      url: 'http://www.youtube.com/EtihadAirways',
      external: true,
    },
    {
      image: { url: twitter, alt: 'Twitter' },
      url: 'http://www.twitter.com/etihad',
      external: true,
    },
  ],
  legalLinks: [
    { title: 'Terms and Conditions', url: '/en/legal/terms-and-conditions' },
    { title: 'Privacy Policy', url: '/en/legal/privacy-policy' },
    { title: 'Cookie Policy', url: '/en/legal/cookie-policy' },
  ],
  copyright: 'Copyright 2020 Etihad Airways. All rights reserved',
  image: { url: abuDhabi, alt: 'Abu Dhabi to the world' },
};
