import { IUserInformation } from './IUserInformation';

export interface IMessage {
  sender: IUserInformation;
  reciever: IUserInformation;
  message: string;
}
