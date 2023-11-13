/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  DeleteOutlined,
  EditOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SkypeOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { Popconfirm, Space, Table, message } from "antd";
import dayjs from "dayjs";
import { IContact, IContactInTable } from "interfaces/contacts.interface";
import { IResponseDataStatus } from "interfaces/utils.interface";
import { Key, useEffect, useState } from "react";
import { IGlobalStore, useGlobalStore } from "store/globalStore";
import styles from "./index.module.scss";
import telegram from "@images/telegram.png";
import { useDisclosure } from "hooks/useDisclosure";
import { ContactTypes } from "constants/contactTypes";
import ModalEditContacts from "components/ModalEditContacts";

export default function Contacts() {
  const getContacts = useGlobalStore(
    (state: IGlobalStore) => state.getContacts
  );
  const [listContacts, setListContacts] = useState<IContactInTable[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
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
      render: (_: unknown, record: unknown) => {
        return (
          <div className={styles.action}>
            <Space>
              <Popconfirm
                title="Delete contacts?"
                description="Are you sure to delete all the contacts of this type?"
                onConfirm={() => {
                  void message.success("Deleted successfully");
                }}
                onCancel={() => {}}
                okText="Yes"
                cancelText="No"
              >
                <DeleteOutlined className={styles.icon} />
              </Popconfirm>
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
  ];
  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
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
        };
      })
    );
  };
  useEffect(() => {
    fetchApi().catch(console.log);
  }, []);

  return (
    <div className={styles.wrapper}>
      <h1>Contacts</h1>
      <Table
        dataSource={listContacts}
        // @ts-ignore
        columns={columns}
        rowSelection={rowSelection}
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
