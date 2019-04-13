import { ICarShareInformation } from './ICarShareInformation';
import { ICoordinates } from './ICoordinates';

export interface IBooking {
  _id?: string;
  carShareId: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
  carShareInformation?: ICarShareInformation;
  locationInformation?: {
    location: ICoordinates;
  };
}
