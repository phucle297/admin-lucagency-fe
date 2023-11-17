/* eslint-disable react-hooks/exhaustive-deps */
import { IInvoice } from "@constants/invoices";
import { IProduct } from "@interfaces/products.interface";
import { InvoiceService } from "@services/invoice.service";
import { ProductsService } from "@services/product.service";
import { FC, useEffect, useState } from "react";

const InvoiceDetail: FC = () => {
  const [invoice, setInvoice] = useState<IInvoice>({} as IInvoice);
  const [products, setProducts] = useState<IProduct[]>([] as IProduct[]);

  const fetchApi = async () => {
    try {
      const productId: string = location.pathname.split("/").pop() as string;
      const resInvoice = await InvoiceService.getInvoiceById(productId);
      const resProd = await ProductsService.getProducts();

      setInvoice({
        ...resInvoice.data,
        key: resInvoice.data.id,
      });
      setProducts({
        ...resProd.data,
        key: resProd.data.id,
      });

      console.log(resInvoice);
      console.log(resProd);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchApi().catch(console.log);
  }, [location.pathname]);

  return <div>InvoiceDetail</div>;
};

export default InvoiceDetail;
