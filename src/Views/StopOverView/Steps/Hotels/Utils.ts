import {
  HotelAvailInfo, HotelRateInfo, Room, RatePlan,
} from '../../../../Services/Responses/ConfirmStopOverResponse';

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

export const getCheapestRoomRatePlan = (hotelRateInfo: HotelRateInfo): RatePlan | undefined => {
  const { rooms } = hotelRateInfo;
  if (rooms === undefined || rooms.room.length === 0) return undefined;
  const minPriceRatePlans: RatePlan[] = [];
  rooms.room.forEach((room: Room) => {
    minPriceRatePlans.push(
      room.ratePlans.ratePlan.reduce(
        (res: RatePlan, obj: RatePlan) => (
          res.rateInfo.netRate < obj.rateInfo.netRate ? res : obj),
      ),
    );
  });
  return minPriceRatePlans.reduce((res: RatePlan, obj: RatePlan) => (
    res.rateInfo.netRate < obj.rateInfo.netRate ? res : obj
  ));
};

export const getCheapestRoomDescription = (hotelRateInfo: HotelRateInfo): string => {
  const { rooms } = hotelRateInfo;
  if (rooms === undefined || rooms.room.length === 0) return '';

  const minPriceRoom = rooms.room.reduce((res: Room, obj: Room) => {
    const resMinRate = res.ratePlans.ratePlan.reduce(
      (min: number, p: RatePlan) => (p.rateInfo.netRate < min ? p.rateInfo.netRate : min), res.ratePlans.ratePlan[0].rateInfo.netRate,
    );
    const objMinRate = obj.ratePlans.ratePlan.reduce(
      (min: number, p: RatePlan) => (p.rateInfo.netRate < min ? p.rateInfo.netRate : min), obj.ratePlans.ratePlan[0].rateInfo.netRate,
    );

    if (resMinRate < objMinRate) return res;
    return obj;
  });
  if (minPriceRoom && minPriceRoom?.roomDescription) return minPriceRoom?.roomDescription.name;
  return '';
};

export const getCheapestRoomRateKey = (hotelRateInfo: HotelRateInfo): string => {
  const { rooms } = hotelRateInfo;
  if (rooms === undefined || rooms.room.length === 0) return '';
  const minPriceRatePlans: RatePlan[] = [];
  rooms.room.forEach((room: Room) => {
    minPriceRatePlans.push(
      room.ratePlans.ratePlan.reduce(
        (res: RatePlan, obj: RatePlan) => (
          res.rateInfo.netRate < obj.rateInfo.netRate ? res : obj),
      ),
    );
  });

  const minPriceRatePlan = minPriceRatePlans.reduce((res: RatePlan, obj: RatePlan) => (
    res.rateInfo.netRate < obj.rateInfo.netRate ? res : obj
  ));
  return minPriceRatePlan.rateKey;
};

export const getCheapestRoomNetRate = (hotelRateInfo: HotelRateInfo): number => {
  const cheapRatePlan = getCheapestRoomRatePlan(hotelRateInfo);
  if (cheapRatePlan) return cheapRatePlan.rateInfo.netRate;
  return 0;
};
