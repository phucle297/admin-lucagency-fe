import { FC } from "react";
import styles from "./index.module.scss";
import { Col, Row } from "antd";
import OrderDetail from "./OrderDetail";
import CustomerInfo from "./CustomerInfo";

const CustomerDetail: FC = () => {
  return (
    <div className={styles.wrapper}>
      <Row gutter={20}>
        <Col xs={24} lg={18}>
          <CustomerInfo />
        </Col>
        <Col xs={24} lg={6}>
          <OrderDetail />
        </Col>
      </Row>
    </div>
  );
};
export default CustomerDetail;
