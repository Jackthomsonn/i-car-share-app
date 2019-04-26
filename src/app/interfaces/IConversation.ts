import { IMessage } from './IMessage';
import { IUserInformation } from './IUserInformation';

export interface IConversation {
  carShareId: string;
  originalSender: IUserInformation;
  originalReciever: IUserInformation;
  messages: IMessage[];
  lastMessage: string;
}
