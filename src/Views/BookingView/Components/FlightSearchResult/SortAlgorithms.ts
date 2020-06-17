import { GroupedOfferModel } from '../../../../Models/OfferModel';
import Utils from '../../../../Utils';

const SortAlgorithms: { [key: string]: (a: GroupedOfferModel, b: GroupedOfferModel) => number} = {
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
  economyPrice: (a: GroupedOfferModel, b: GroupedOfferModel) => {
    const aVal = a.cabinClasses.Economy.startingFrom.amount;
    const bVal = b.cabinClasses.Economy.startingFrom.amount;

    if (aVal < bVal) {
      return -1;
    }

    if (aVal > bVal) {
      return 1;
    }

    return 0;
  },
  businessPrice: (a: GroupedOfferModel, b: GroupedOfferModel) => {
    const aVal = a.cabinClasses.Business.startingFrom.amount;
    const bVal = b.cabinClasses.Business.startingFrom.amount;

    if (aVal < bVal) {
      return -1;
    }

    if (aVal > bVal) {
      return 1;
    }

    return 0;
  },
};

export default SortAlgorithms;
