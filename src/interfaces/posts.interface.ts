export interface IPost {
  author: string;
  state: string;
  categories: string[];
  hot_topic: boolean;
  translations?: IPostTranslation[];
  key?: string;
  _id?: string;
}

export interface IPostTranslation {
  key?: string;
  title: string;
  description: string;
  language: string;
  path?: string;
}
