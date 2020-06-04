import { TripType } from '../../Enums/TripType';
import { PassengerPickerData } from './Components/PassengerPicker';
import { CabinType } from '../../Enums/CabinType';
import { OriginDestinationPickerData } from './Components/OriginDestinationPicker';
import { CalendarData } from './Components/Calendar';

export interface TripSearchData {
  tripType: TripType;
  passengers: PassengerPickerData;
  cabinType: CabinType;
  originDestination: OriginDestinationPickerData;
  dates: CalendarData;
  bookWithMiles: boolean;
}
