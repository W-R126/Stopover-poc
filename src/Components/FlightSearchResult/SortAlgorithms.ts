import { CabinClassEnum } from '../../Enums/CabinClassEnum';
import { FlightOfferModel } from '../../Models/FlightOfferModel';

export type SortAlgorithm = (a: FlightOfferModel, b: FlightOfferModel) => number;

function getCabinClassSort(cabinClass: CabinClassEnum): any {
  return (a: FlightOfferModel, b: FlightOfferModel): number => {
    const aVal = a.cheapestFares.find((cf) => cf.cabinClass === cabinClass)?.price.total ?? -1;
    const bVal = b.cheapestFares.find((cf) => cf.cabinClass === cabinClass)?.price.total ?? -1;

    if (aVal === -1 && bVal === -1) {
      return 0;
    }

    if (aVal === -1 || aVal > bVal) {
      return 1;
    }

    if (bVal === -1 || aVal < bVal) {
      return -1;
    }

    return 0;
  };
}

function compareDates(a: Date, b: Date): number {
  if (a < b) {
    return -1;
  }

  if (a > b) {
    return 1;
  }

  return 0;
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
  departure: (a: FlightOfferModel, b: FlightOfferModel) => compareDates(a.departure, b.departure),
  arrival: (a: FlightOfferModel, b: FlightOfferModel) => compareDates(a.arrival, b.arrival),
  stopCount: (a: FlightOfferModel, b: FlightOfferModel) => {
    if (a.stops.length < b.stops.length) {
      return -1;
    }

    if (a.stops.length > b.stops.length) {
      return 1;
    }

    return 0;
  },
  travelTime: (a: FlightOfferModel, b: FlightOfferModel) => {
    if (a.duration < b.duration) {
      return -1;
    }

    if (a.duration > b.duration) {
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
