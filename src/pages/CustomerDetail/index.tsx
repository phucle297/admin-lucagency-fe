/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from "react";
import styles from "./index.module.scss";
import { Col, Row } from "antd";
import OrderDetail from "./OrderDetail";
import CustomerInfo from "./CustomerInfo";
import { ICustomer } from "@interfaces/customer.interface";
import { CustomersService } from "@services/customers.service";

const CustomerDetail: FC = () => {
  const [customer, setCustomer] = useState<ICustomer>({} as ICustomer);
  const fetchApi = async () => {
    try {
      const customerId: string = location.pathname.split("/").pop() as string;
      const res = await CustomersService.getCustomerById(customerId);

      setCustomer({
        ...res.data,
      });
      console.log(res);
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
        <Col xs={24} lg={customer?.only_consult ? 24 : 18}>
          <CustomerInfo customer={customer} fetchApi={fetchApi} />
        </Col>
        {!customer?.only_consult && (
          <Col xs={24} lg={6}>
            <OrderDetail customer={customer} fetchApi={fetchApi} />
          </Col>
        )}
      </Row>
    </div>
  );
};
export default CustomerDetail;
