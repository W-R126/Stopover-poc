import { HotelAvailInfo } from '../../../../Services/Responses/ConfirmStopOverResponse';

export const HOTEL_RATING_RANGE = ['3', '4', '5'];
export const HOTEL_SORT_RANGE = [
  'Recommended',
  'Lowest price',
  'Highest price',
  'Hotel Class',
  'Check-in time',
];
export const HOTEL_AMENTITY_RANGE = [
  { title: 'Air Conditioned', codes: [10, 170, 180] },
  { title: 'Free Internet', codes: [100, 250, 261] },
  { title: 'Pool', codes: [306, 362, 363, 555, 575] },
  { title: 'Free Breakfast', codes: [30, 35, 40] },
  { title: 'Kid-friendly', codes: [340] },
  { title: 'Pet-friendly', codes: [535, 540] },
  { title: 'Bar', codes: [130] },
  { title: 'Restaurant', codes: [200] },
  { title: 'Spa', codes: [620, 39, 460] },
];

export const getNetRateOfHotelAvailInfo = (hotelAvailInfo: HotelAvailInfo): number => {
  const { rooms } = hotelAvailInfo.hotelRateInfo;
  if (rooms === undefined || rooms.room.length === 0) return -1;
  return rooms.room[0].ratePlans.ratePlan[0].rateInfo.netRate;
};
