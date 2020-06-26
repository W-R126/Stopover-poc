import { GroupedOfferModel } from '../../../../Models/OfferModel';
import Utils from '../../../../Utils';
import { CabinClassEnum } from '../../../../Enums/CabinClassEnum';

export type SortAlgorithm = (a: GroupedOfferModel, b: GroupedOfferModel) => number;

function getCabinClassSort(cabinClass: CabinClassEnum): any {
  let cabinClassName = 'Economy';

  switch (cabinClass) {
    case CabinClassEnum.economy:
      break;
    case CabinClassEnum.business:
      cabinClassName = 'Business';
      break;
    case CabinClassEnum.first:
      cabinClassName = 'First';
      break;
    case CabinClassEnum.residence:
      cabinClassName = 'Residence';
      break;
    default:
      break;
  }

  return (a: GroupedOfferModel, b: GroupedOfferModel): number => {
    if (!(a.cabinClasses as any)[cabinClassName]) {
      return 1;
    }

    if (!(b.cabinClasses as any)[cabinClassName]) {
      return -1;
    }

    const aVal = (a.cabinClasses as any)[cabinClassName]?.startingFrom.amount ?? 0;
    const bVal = (b.cabinClasses as any)[cabinClassName]?.startingFrom.amount ?? 0;

    if (aVal < bVal) {
      return -1;
    }

    if (aVal > bVal) {
      return 1;
    }

    return 0;
  };
}

const SortAlgorithms: {
  departure: SortAlgorithm;
  arrival: SortAlgorithm;
  stopCount: SortAlgorithm;
  travelTime: SortAlgorithm;
  economyPrice: SortAlgorithm;
  businessPrice: SortAlgorithm;
  firstPrice: SortAlgorithm;
  residencePrice: SortAlgorithm;
} = {
  departure: (a: GroupedOfferModel, b: GroupedOfferModel) => Utils.compareDatesExact(
    a.departure,
    b.departure,
  ),
  arrival: (a: GroupedOfferModel, b: GroupedOfferModel) => Utils.compareDatesExact(
    a.arrival,
    b.arrival,
  ),
  stopCount: (a: GroupedOfferModel, b: GroupedOfferModel) => {
    if (a.stops.length < b.stops.length) {
      return -1;
    }

    if (a.stops.length > b.stops.length) {
      return 1;
    }

    return 0;
  },
  travelTime: (a: GroupedOfferModel, b: GroupedOfferModel) => {
    const aVal = a.arrival.valueOf() - a.departure.valueOf();
    const bVal = b.arrival.valueOf() - b.departure.valueOf();

    if (aVal < bVal) {
      return -1;
    }

    if (aVal > bVal) {
      return 1;
    }

    return 0;
  },
  economyPrice: getCabinClassSort(CabinClassEnum.economy),
  businessPrice: getCabinClassSort(CabinClassEnum.business),
  firstPrice: getCabinClassSort(CabinClassEnum.first),
  residencePrice: getCabinClassSort(CabinClassEnum.residence),
};

export default SortAlgorithms;
