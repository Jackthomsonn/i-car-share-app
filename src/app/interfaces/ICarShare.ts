import { ICar } from './ICar';
import { ICoordinates } from './ICoordinates';
import { IOwner } from './IOwner';

export interface ICarShare {
  carId: string;
  price: number;
  origin: ICoordinates;
  destination: ICoordinates;
  createdAt?: string;
  carInformation?: ICar;
  ownerInformation?: IOwner;
  runningDays: string[];
  distance?: {
    calculatedDistance: number,
    location: ICoordinates
  };
}
