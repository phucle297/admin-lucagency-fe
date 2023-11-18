import { IInvoice, IInvoiceOrderProduct } from "@constants/invoices";
import Logo from "@images/logo.png";
import dayjs from "dayjs";
import { FC } from "react";
import styles from "./index.module.scss";
interface IPdf {
  invoiceData: IInvoice;
}

const Pdf: FC<IPdf> = ({ invoiceData }) => {
  return (
    <div
      style={{
        background: "white",
        padding: "100px",
      }}
      className={styles.wrapper}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <img
          src={Logo}
          alt=""
          style={{
            width: "300px",
          }}
        />

        <h3>INVOICE</h3>
      </div>

      <div
        style={{
          marginTop: "20px",
        }}
      >
        <b>From:</b>
        <p>Luca Marketing Agency</p>
        <p>No. 304 Ho Tung Mau</p>
        <p>Bac Tu Liem Dis. Ha Noi - Viet Nam</p>
        <p>support@lucagency.net</p>
      </div>

      <table
        border={1}
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          textAlign: "right",
        }}
      >
        <tbody>
          <tr>
            <th
              style={{
                padding: "5px",
              }}
            >
              Invoice Number
            </th>
            <td
              style={{
                padding: 5,
              }}
            >
              {invoiceData.invoice_number}
            </td>
          </tr>
          <tr>
            <th
              style={{
                padding: "5px",
              }}
            >
              Order Number
            </th>
            <td
              style={{
                padding: 5,
              }}
            >
              {invoiceData.order_number}
            </td>
          </tr>
          <tr>
            <th
              style={{
                padding: "5px",
              }}
            >
              Invoice Date
            </th>
            <td
              style={{
                padding: 5,
              }}
            >
              {dayjs(invoiceData.invoice_date).format("MMMM DD, YYYY")}
            </td>
          </tr>
          <tr>
            <th
              style={{
                padding: "5px",
              }}
            >
              Total Due
            </th>
            <td
              style={{
                padding: 5,
                fontWeight: "bold",
              }}
            >
              $ {invoiceData?.total_due?.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>

      <br />
      <p
        style={{
          marginTop: 5,
          fontWeight: "bold",
        }}
      >
        To: {invoiceData.customer_contact}
      </p>

      <table
        border={1}
        style={{
          width: "100%",
          marginTop: "10px",
          borderCollapse: "collapse",
          textAlign: "right",
        }}
      >
        <thead>
          <tr>
            <th
              style={{
                padding: 5,
                textAlign: "center",
              }}
            >
              Hrs/Qty
            </th>
            <th
              style={{
                padding: 5,
                textAlign: "left",
              }}
            >
              Service
            </th>
            <th
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              Rate/Price
            </th>
            <th
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              Adjust
            </th>
            <th
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              Sub Total
            </th>
          </tr>
        </thead>
        <tbody>
          {invoiceData?.order_products?.map((product: IInvoiceOrderProduct) => {
            return (
              <tr>
                <td
                  style={{
                    padding: 5,
                    textAlign: "center",
                  }}
                >
                  {product?.quantity}
                </td>
                <td
                  style={{
                    padding: 5,
                    textAlign: "left",
                  }}
                >
                  {product?.service}
                </td>
                <td
                  style={{
                    padding: 5,
                    textAlign: "right",
                  }}
                >
                  {product?.price}
                </td>
                <td
                  style={{
                    padding: 5,
                    textAlign: "right",
                  }}
                >
                  {product?.adjust}%
                </td>
                <td
                  style={{
                    padding: 5,
                    textAlign: "right",
                  }}
                >
                  {(
                    Number(product?.price) *
                    Number(product?.quantity) *
                    (1 - Number(product?.adjust) / 100)
                  )?.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <table
        border={1}
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse",
          textAlign: "right",
        }}
      >
        <tbody>
          <tr>
            <td
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              Sub total
            </td>
            <td
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              $ {invoiceData?.sub_total?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              Tax
            </td>
            <td
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              $ {invoiceData?.tax?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <td
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              Paid
            </td>
            <td
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              $ {invoiceData?.paid?.toFixed(2)}
            </td>
          </tr>
          <tr>
            <th
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              Total Due
            </th>
            <th
              style={{
                padding: 5,
                textAlign: "right",
              }}
            >
              $ {invoiceData?.total_due?.toFixed(2)}
            </th>
          </tr>
        </tbody>
      </table>

      <p
        className={styles.footer}
        style={{
          borderTop: "1px solid black",
          marginTop: 20,
          paddingTop: 10,
          paddingBottom: 10,
          borderBottom: "1px solid black",
          textAlign: "center",
        }}
      >
        Payment is due within 30 days from date of invoice. Late payment is
        subject to fees of 5$ per month.
      </p>
    </div>
  );
};

export default Pdf;
