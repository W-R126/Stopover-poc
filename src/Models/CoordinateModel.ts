export interface CoordinateModel {
  lat: number;
  long: number;
}

export function copyCoordinates(coordinates: CoordinateModel): CoordinateModel {
  return {
    lat: coordinates.lat,
    long: coordinates.long,
  };
}
