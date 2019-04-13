import { ICarInformation } from './ICarInformation';

export interface IReview {
  rating: number;
  message: string;
  reviewerId: string;
  carShareId: string;
  createdAt?: string;
  updatedAt?: string;
  carInformation?: ICarInformation;
}
