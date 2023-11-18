export interface IInvoice {
  key?: string;
  _id?: string;
  invoice_date?: string;
  invoice_number: string;
  order_number: string;
  customer_contact: string;
  sub_total: number;
  paid: number;
  tax: number;
  total_due: number;
  order_products: IInvoiceOrderProduct[];
  created_at?: string;
  updated_at?: string;
}

export interface IInvoiceOrderProduct {
  quantity: string | number;
  service: string;
  price: string | number;
  adjust: string | number;
}
