export interface StopOverModel {
  airportCode: string;
  days: number[];
  customerSegment: CustomerSegment;
}

export type CustomerSegment = 'Family' | 'Leisure' | 'Business';
