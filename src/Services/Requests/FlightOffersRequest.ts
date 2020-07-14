export interface FlightOffersRequest {
  passengers: {
    ADT?: number;
    CHD?: number;
    INF?: number;
  };
  currency: string;
  searchType: 'BRANDED';
  itineraryParts: {
    from: {
      code: string;
    };
    to: {
      code: string;
    };
    when: {
      date: string;
    };
  }[];
  cabinClass?: 'Economy' | 'Business' | 'First' | 'Residence';
}
