export interface IContact {
  _id: string;
  type: string;
  values: unknown[];
  display: boolean;
  created_at: string;
  updated_at: string;
}

export interface ITelegramInTable {
  data?: string;
  blue_check?: boolean;
}
export interface IContactInTable {
  _id?: string;
  key: string;
  amount: number;
  type: string;
  date: string;
  values?: string[] | ITelegramInTable[];
  display?: boolean;
}
