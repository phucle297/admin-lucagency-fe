export interface IProduct {
  _id: string;
  title: string;
  price: number;
  discount_price: number;
  category: string;
  available_quantity: number;
  nation: string;
  highlights: string[];
  created_at: string;
  updated_at: string;
}

export interface IProductInTable {
  _id?: string;
  key: string;
  title: string;
  price: number;
  nation: string;
  available_quantity: number;
  category: string;
  discount_price?: number;
  highlights?: string[];
}

export interface IProductImage {
  _id: string;
  created_at: string;
  path: string;
  product_id: string;
  size: number;
  updated_at: string;
}
