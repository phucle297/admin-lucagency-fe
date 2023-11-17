/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CustomerStateEnum } from "@constants/customer";
import { ICustomer } from "@interfaces/customer.interface";
import { FC } from "react";
import styles from "./index.module.scss";
import { Col, Divider, Form, Input, Row, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { CustomersService } from "@services/customers.service";

interface ICustomerInfoProps {
  customer: ICustomer;
  fetchApi: () => void;
}
const CustomerInfo: FC<ICustomerInfoProps> = ({ customer, fetchApi }) => {
  return (
    <div className={styles.wrapper}>
      <div
        className="flex justifyBetween"
        style={{
          marginBottom: 10,
        }}
      >
        <div className="flex alignCenter gap10">
          <h1>Customer Detail</h1>
          {customer.status === CustomerStateEnum.WAITING && (
            <span className="tagYellow">{CustomerStateEnum.WAITING}</span>
          )}
          {customer.status === CustomerStateEnum.COMPLETED && (
            <span className="tagGreen">{CustomerStateEnum.COMPLETED}</span>
          )}
          {customer.status === CustomerStateEnum.ADVISE && (
            <span className="tagGray">{CustomerStateEnum.ADVISE}</span>
          )}
        </div>
        {customer?.only_consult && (
          <button
            className="primaryBtn"
            onClick={async () => {
              try {
                await CustomersService.updateStatusToCompleted(customer?._id);
                fetchApi();
                message.success("Updated status to completed");
              } catch (error) {
                console.log(error);
                // @ts-ignore
                message.error(error?.message);
              }
            }}
          >
            Advised
          </button>
        )}
      </div>

      <h2
        style={{
          marginBottom: 10,
        }}
      >
        Bill Details
      </h2>
      <Row gutter={20}>
        <Col xs={24} lg={12}>
          <div className={styles.inputGroup}>
            <p
              style={{
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Name
            </p>
            <Form.Item name="name">
              <div>
                <Input disabled value={customer?.name} name="name" />
              </div>
            </Form.Item>
          </div>
          <div className={styles.inputGroup}>
            <p
              style={{
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Company Name
            </p>
            <Form.Item name="company_name">
              <div>
                <Input
                  disabled
                  value={customer?.company_name}
                  name="company_name"
                />
              </div>
            </Form.Item>
          </div>
          <div className={styles.inputGroup}>
            <p
              style={{
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Country
            </p>
            <Form.Item name="country">
              <div>
                <Input disabled value={customer?.country} name="country" />
              </div>
            </Form.Item>
          </div>
          <div className={styles.inputGroup}>
            <p
              style={{
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              State
            </p>
            <Form.Item name="state">
              <div>
                <Input disabled value={customer?.state} name="state" />
              </div>
            </Form.Item>
          </div>
        </Col>
        <Col xs={24} lg={12}>
          <div className={styles.inputGroup}>
            <p
              style={{
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Phone number
            </p>
            <Form.Item name="phone">
              <div>
                <Input disabled value={customer?.phone} name="phone" />
              </div>
            </Form.Item>
          </div>
          <div className={styles.inputGroup}>
            <p
              style={{
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Email
            </p>
            <Form.Item name="email">
              <div>
                <Input disabled value={customer?.email} name="email" />
              </div>
            </Form.Item>
          </div>
          <div className={styles.inputGroup}>
            <p
              style={{
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Telegram
            </p>
            <Form.Item name="telegram">
              <div>
                <Input disabled value={customer?.telegram} name="telegram" />
              </div>
            </Form.Item>
          </div>
        </Col>
      </Row>

      <Divider />
      <h2
        style={{
          marginBottom: 10,
        }}
      >
        Additional Information
      </h2>

      <div className={styles.inputGroup}>
        <p
          style={{
            fontWeight: "bold",
            marginBottom: 10,
          }}
        >
          Order Notes
        </p>
        <Form.Item name="message">
          <div>
            <TextArea
              rows={8}
              disabled
              value={customer?.message}
              name="message"
            />
          </div>
        </Form.Item>
      </div>
    </div>
  );
};

export default CustomerInfo;
