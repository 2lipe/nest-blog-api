import { IProfileResponse } from './profile';

export interface IFindAllQuery {
  limit?: number;
  offset?: number;
  author?: string;
  favorited?: string;
  tag?: string;
}

export type IFindFeedQuery = IFindAllQuery;

export interface IArticleResponse {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
  favorited: boolean | null;
  favoritesCount: number;
  author: IProfileResponse;
}
