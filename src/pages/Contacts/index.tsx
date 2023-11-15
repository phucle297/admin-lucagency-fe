/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import { nanoid } from "nanoid";
import { IGlobalStore, useGlobalStore } from "@stores/globalStore";
import styles from "./index.module.scss";
import { useEffect, useState } from "react";
import { IContact, IContactInTable } from "@interfaces/contacts.interface";
import { useDisclosure } from "@hooks/useDisclosure";
import { ContactTypes } from "@constants/contactTypes";
import {
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SkypeOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import telegram from "@images/telegram.png";
import { Space, Switch, Table, message } from "antd";
import dayjs from "dayjs";
import { IResponseDataStatus } from "@interfaces/utils.interface";
import ModalEditContacts from "@pages/Contacts/ModalEditContacts";

export default function Contacts() {
  const getContacts = useGlobalStore(
    (state: IGlobalStore) => state.getContacts
  );
  const updateContacts = useGlobalStore(
    (state: IGlobalStore) => state.updateContacts
  );
  const [listContacts, setListContacts] = useState<IContactInTable[]>([]);
  const [selectedRow, setSelectedRow] = useState<IContactInTable>(
    {} as IContactInTable
  );
  const modalEditContacts = useDisclosure();
  const columns = [
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text: string, record: IContactInTable) => {
        let icon;
        switch (text) {
          case ContactTypes.HOTLINE:
            icon = <PhoneOutlined />;
            break;
          case ContactTypes.WHATS_APP:
            icon = <WhatsAppOutlined />;
            break;
          case ContactTypes.EMAIL_SUPPORT:
            icon = <MailOutlined />;
            break;
          case ContactTypes.TELEGRAM:
            icon = (
              <img src={telegram} alt="telegram" className={styles.telegram} />
            );
            break;
          case ContactTypes.ADDRESS:
            icon = <EnvironmentOutlined />;
            break;
          case ContactTypes.SKYPE:
            icon = <SkypeOutlined />;
            break;
          default:
            break;
        }

        return (
          <Space className={styles.type}>
            <div className={styles.icon}>{icon}</div>
            <div className={styles.name}>
              {record.type[0].toUpperCase()}
              {record.type.slice(1).replace("_", " ")}
            </div>
          </Space>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text: string) => (
        <div>
          <p>{dayjs(text).format("YYYY/MM/DD")}</p>
          <p>{dayjs(text).format("HH:mm a")}</p>
        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_: unknown, record: unknown) => {
        return (
          <div className={styles.action}>
            <Space>
              <EditOutlined
                className={styles.icon}
                onClick={() => {
                  setSelectedRow(record as IContactInTable);
                  modalEditContacts.handleOpen(true);
                }}
              />
            </Space>
          </div>
        );
      },
    },
    {
      title: "Display",
      dataIndex: "display",
      key: "display",
      render: (_: string, record: IContactInTable) => {
        return (
          <Switch
            defaultChecked={record.display}
            onChange={() => {
              updateContacts(record._id as string, {
                display: !record.display,
              })
                .then(() => {
                  void message.success("Update display successfully");
                  fetchApi().catch(console.log);
                })
                .catch((error) => {
                  void message.error(error.message);
                });
            }}
          />
        );
      },
    },
  ];

  const fetchApi = async () => {
    const res: IResponseDataStatus = await getContacts();
    const dataListContact: IContact[] = res.data as IContact[];
    setListContacts(
      dataListContact.map((item: IContact) => {
        return {
          _id: item._id,
          key: item._id,
          type: item.type,
          amount: item.values.length,
          date: item.updated_at,
          values: item.values,
          display: item.display,
        };
      })
    );
  };
  useEffect(() => {
    fetchApi().catch(console.log);
  }, []);
  const expandedRowRender = (record: IContactInTable) => {
    const columns = [
      {
        title: "Type",
        dataIndex: "type",
        key: "type",
        width: 200,
        render: (type: string) => {
          switch (type) {
            case ContactTypes.HOTLINE:
              return <PhoneOutlined />;
            case ContactTypes.WHATS_APP:
              return <WhatsAppOutlined />;
            case ContactTypes.EMAIL_SUPPORT:
              return <MailOutlined />;
            case ContactTypes.TELEGRAM:
              return (
                <img
                  src={telegram}
                  alt="telegram"
                  className={styles.telegram}
                />
              );
            case ContactTypes.ADDRESS:
              return <EnvironmentOutlined />;
            case ContactTypes.SKYPE:
              return <SkypeOutlined />;
            default:
              return null;
          }
        },
      },
      { title: "Values", dataIndex: "value", key: "value" },
    ];
    const data = [];
    // @ts-ignore
    for (let i = 0; i < record?.values?.length; ++i) {
      if (record?.values?.[i] && record?.values) {
        data.push({
          key: nanoid(),
          type: record.type,
          value: record?.values[i],
        });
      }
    }
    return <Table columns={columns} dataSource={data} pagination={false} />;
  };
  return (
    <div className={styles.wrapper}>
      <h1>Contacts</h1>
      <Table
        pagination={false}
        scroll={{ x: 500 }}
        dataSource={listContacts}
        // @ts-ignore
        columns={columns}
        expandable={{ expandedRowRender }}
      />
      <ModalEditContacts
        isOpen={modalEditContacts.isOpen}
        handleOpen={modalEditContacts.handleOpen}
        selectedRow={selectedRow}
        callApi={fetchApi}
      />
    </div>
  );
}
