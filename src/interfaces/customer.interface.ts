import { IOrder } from "./orders.interface";

export interface ICustomer {
  key?: string;
  _id: string;
  name: string;
  email: string;
  company_name: string;
  telegram: string;
  services: string[];
  message: string;
  only_consult: boolean;
  orders: IOrder[];
  sub_total: number;
  total: number;
  status: string;
  created_at: string;
  updated_at: string;
}