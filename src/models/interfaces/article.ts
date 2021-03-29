export interface IFindAllQuery {
  limit?: number;
  offset?: number;
  author?: string;
  favorited?: string;
  tag?: string;
}

export type IFindFeedQuery = IFindAllQuery;
