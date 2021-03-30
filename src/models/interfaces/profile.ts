import { IUserResponse } from './user';

export interface IProfileResponse extends IUserResponse {
  following: boolean | null;
}
