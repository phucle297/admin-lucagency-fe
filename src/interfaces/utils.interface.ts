export interface IResponseDataStatus {
  status: number;
  data: unknown;
  extras?: {
    limit?: number;
    page?: number;
    total?: number;
    total_page?: number;
  };
}
