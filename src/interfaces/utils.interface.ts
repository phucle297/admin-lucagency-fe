export interface IResponseDataStatus {
  status: number;
  data: unknown;
  extras?: {
    limit?: number;
    page?: number;
    total?: number;
    total_page?: number;
    accounts?: number;
    content?: number;
    sales?: number;
    seo?: number;
    drafts?: number;
    published_posts?: number;
    account_executives?: number;
  };
}
