import { TripType } from '../../Enums/TripType';
import { PassengerPickerData } from '../PassengerPicker';
import { CabinType } from '../../Enums/CabinType';
import { OriginDestinationPickerData } from '../OriginDestinationPicker';
import { CalendarData } from '../Calendar';

export interface TripSearchData {
  tripType: TripType;
  passengers: PassengerPickerData;
  cabinType: CabinType;
  originDestination: OriginDestinationPickerData;
  dates: CalendarData;
  bookWithMiles: boolean;
}
