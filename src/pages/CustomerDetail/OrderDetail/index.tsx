/* eslint-disable @typescript-eslint/ban-ts-comment */
import { IOrder } from "@interfaces/orders.interface";
import { FC } from "react";
import styles from "./index.module.scss";
import { ICustomer } from "@interfaces/customer.interface";
import { Divider, message } from "antd";
import { CustomersService } from "@services/customers.service";
import { useNavigate } from "react-router-dom";
interface IOrderDetailProps {
  customer: ICustomer;
  fetchApi: () => void;
}
const OrderDetail: FC<IOrderDetailProps> = ({ customer, fetchApi }) => {
  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      <h1
        style={{
          marginBottom: 10,
        }}
      >
        Order Detail
      </h1>

      <h2>Product(s)</h2>

      <div className={styles.table}>
        <div className={styles.top}>
          <div className="flex justifyBetween">
            <p className="fade">Product</p>
            <p className="fade">Sub total</p>
          </div>
        </div>
        <div className={styles.bottom}>
          {customer?.orders?.map((item: IOrder) => (
            <div className="flex justifyBetween">
              <p>
                {item?.title}x{item?.quantity}
              </p>
              <p>${item?.price * item?.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      <Divider />
      <h2>Total</h2>
      <div className={styles.table2}>
        <div className="flex">
          <p>Sub total</p>
          <p className={styles.bgGray}>${customer?.sub_total}</p>
        </div>
        <div className="flex">
          <p>Sub total</p>
          <p className={styles.bgGrayBold}>${customer?.total}</p>
        </div>
      </div>

      <Divider />

      <div className="flex gap10">
        <button
          className="secondaryBtn w100"
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
        <button
          className="primaryBtn w100"
          onClick={() => {
            navigate(`/invoices/create?customer_id=${customer._id}`);
          }}
        >
          Invoice
        </button>
      </div>
    </div>
  );
};

export default OrderDetail;
