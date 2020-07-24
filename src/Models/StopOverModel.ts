import { CustomerSegmentEnum } from '../Enums/CustomerSegment';

export interface StopOverModel {
  airportCode: string;
  days: number[];
  customerSegment: CustomerSegmentEnum;
}
