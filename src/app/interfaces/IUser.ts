export interface IUser {
  _id?: string;
  username: string;
  password: string;
  email: string;
  phoneNumber?: number;
  twoFactorAuthEnabled?: boolean;
  properties?: any;
}
