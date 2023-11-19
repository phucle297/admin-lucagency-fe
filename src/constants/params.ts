export interface IParamsPost {
  page?: number;
  limit?: number;
  search?: string | undefined;
  state?: string | undefined;
  hot_topic?: boolean | string | undefined;
  language?: string | undefined;
}

export interface IParamsUser {
  search?: string | undefined;
}
export interface IParamsSearch {
  search?: string | undefined;
}

export interface IParamsPricing{
  page?: number;
  limit?: number;
  search?: string | undefined;
  category?: string | undefined;
}