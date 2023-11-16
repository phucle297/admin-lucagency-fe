export interface IParamsPost {
  page: number;
  limit: number;
  search: string | undefined;
  state: string | undefined;
  hot_topic: boolean | string | undefined;
  language: string | undefined;
}
