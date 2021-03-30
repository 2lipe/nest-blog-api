import { IUserResponse } from './user';

export interface IAuthResponse extends IUserResponse {
  token: string;
}
