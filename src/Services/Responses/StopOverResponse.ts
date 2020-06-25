export interface StopOverResponse {
  airportCode: string;
  stopoverDays: number[];
  customerSegment: 'Family' | 'Leisure' | 'Business';
  modelType: 'UNKNOWN_ML_MODEL_TYPE' | 'FLIGHT_SELECTED_BASED' | 'AIR_SEARCH_PARAMS_BASED';
}
