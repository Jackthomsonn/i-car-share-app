import { IUserInformation } from './IUserInformation';

export interface ICar {
  _id?: string;
  ownerId: string;
  make: string;
  reg: string;
  rules: string[];
  passengers: number;
  createdAt?: string;
  updatedAt?: string;
  userInformation?: IUserInformation;
}
