export interface IContact {
  _id: string;
  type: string;
  values: unknown[];
  display: boolean;
  created_at: string;
  updated_at: string;
}

export interface IContactInTable {
  key: string;
  amount: number;
  type: string;
  date: string;
}
