import { ICoordinates } from './ICoordinates';

export interface ICarShareInformation {
  _id: string;
  ownerId: string;
  make: string;
  reg: string;
  rules: string[];
  passengers: number;
  origin: ICoordinates;
  destination: ICoordinates;
}
