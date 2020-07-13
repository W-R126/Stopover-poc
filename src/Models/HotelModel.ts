import { HotelAvailInfo } from '../Services/Responses/ConfirmStopOverResponse';

export interface HotelModel extends HotelAvailInfo {
  checkIn: Date;
  checkOut: Date;
}
