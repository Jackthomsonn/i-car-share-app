import { Days } from './../enums/days';
import { ICarInformation } from './ICarInformation';
import { ICoordinates } from './ICoordinates';
import { IOwnerInformation } from './IOwnerInformation';
import { IDistance } from './IDistance';

export interface ICarShare {
  _id?: string;
  ownerId: string;
  carId: string;
  origin: ICoordinates;
  destination: ICoordinates;
  price: number;
  runningDays: Days[];
  bookingId?: string;
  createdAt?: string;
  updatedAt?: string;
  distance?: IDistance;
  carInformation?: ICarInformation;
  ownerInformation?: IOwnerInformation;
}
