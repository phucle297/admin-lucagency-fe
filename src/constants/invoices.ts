export interface IInvoice {
  invoice_number: string;
  order_number: string;
  customer_contact: string;
  sub_total: number;
  paid: number;
  tax: number;
  total_due: number;
  order_products: {
    quantity: number;
    service: string;
    price: number;
    adjust: number;
  };
}
