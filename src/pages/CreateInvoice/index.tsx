/* eslint-disable react-hooks/exhaustive-deps */
import { ICustomer } from "@interfaces/customer.interface";
import { IProduct } from "@interfaces/products.interface";
import { CustomersService } from "@services/customers.service";
import { ProductsService } from "@services/product.service";
import { FC, useEffect, useState } from "react";
import InvoiceDetail from "./InvoiceDetail";
import styles from "./index.module.scss";
import { Col, Row } from "antd";
import Publish from "./Publish";
const CreateInvoice: FC = () => {
  const [products, setProducts] = useState<IProduct[]>([] as IProduct[]);
  const [customer, setCustomer] = useState<ICustomer>({} as ICustomer);

  const fetchApi = async () => {
    try {
      const resProd = await ProductsService.getProducts();
      setProducts({
        ...resProd.data,
        key: resProd.data.id,
      });
      if (!location.search) return;
      const customerId: string = location.search?.split("=").pop() as string;
      const resCustomer = await CustomersService.getCustomerById(customerId);
      setCustomer({
        ...resCustomer.data,
        key: resCustomer.data.id,
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchApi().catch(console.log);
  }, [location.pathname]);

  return (
    <div className={styles.wrapper}>
      <Row gutter={20}>
        <Col xs={24} lg={18}>
          <InvoiceDetail products={products} customer={customer} />
        </Col>
        <Col xs={24} lg={6}>
          <Publish />
        </Col>
      </Row>
    </div>
  );
};

export default CreateInvoice;
