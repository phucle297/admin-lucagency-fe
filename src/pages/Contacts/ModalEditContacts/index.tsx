/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Input, Modal, Switch } from "antd";
import { IContactInTable } from "interfaces/contacts.interface";
import { FC, ReactNode, useEffect, useState } from "react";
import styles from "./index.module.scss";
import {
  DeleteOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
  SkypeOutlined,
  WhatsAppOutlined,
} from "@ant-design/icons";
import { useGlobalStore } from "@stores/globalStore";
import { ContactTypes } from "constants/contactTypes";
import telegram from "@images/telegram.png";

interface IModalEditContactsProps {
  isOpen: boolean;
  handleOpen: (open: boolean) => void;
  selectedRow: IContactInTable;
  callApi: () => void;
}
const ModalEditContacts: FC<IModalEditContactsProps> = ({
  isOpen,
  handleOpen,
  selectedRow,
  callApi,
}) => {
  const [listContacts, setListContacts] = useState<string[]>([]);
  const updateContacts = useGlobalStore((state) => state.updateContacts);
  const [title, setTitle] = useState<string>("");
  const [icon, setIcon] = useState<ReactNode>(null);
  const [type, setType] = useState<string>("");
  useEffect(() => {
    setListContacts(selectedRow?.values as string[]);
    const type = selectedRow?.type?.toLowerCase().replace(" ", "_");
    switch (type) {
      case ContactTypes.HOTLINE:
        setIcon(<PhoneOutlined className={styles.iconLeft} />);
        setTitle("Edit Hotline");
        setType(ContactTypes.HOTLINE);
        break;
      case ContactTypes.WHATS_APP:
        setIcon(<WhatsAppOutlined className={styles.iconLeft} />);
        setTitle("Edit Whats App");
        setType(ContactTypes.WHATS_APP);
        break;
      case ContactTypes.EMAIL_SUPPORT:
        setIcon(<MailOutlined className={styles.iconLeft} />);
        setTitle("Edit Email Support");
        setType(ContactTypes.EMAIL_SUPPORT);
        break;
      case ContactTypes.SKYPE:
        setIcon(<SkypeOutlined className={styles.iconLeft} />);
        setTitle("Edit Skype");
        setType(ContactTypes.SKYPE);
        break;
      case ContactTypes.ADDRESS:
        setIcon(<EnvironmentOutlined className={styles.iconLeft} />);
        setTitle("Edit Address");
        setType(ContactTypes.ADDRESS);
        break;
      case ContactTypes.TELEGRAM:
        setIcon(
          <img src={telegram} alt="telegram" className={styles.iconLeft} />
        );
        setTitle("Edit Telegram");
        setType(ContactTypes.TELEGRAM);
        break;
      default:
        break;
    }
  }, [selectedRow, isOpen]);
  const handleClose = () => {
    handleOpen(false);
    setListContacts([]);
  };
  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        handleClose();
      }}
      footer={null}
      className={styles.modal}
    >
      <div className={styles.header}>
        <h2>{title}</h2>

        <div className={styles.controls}>
          <button
            className="secondaryBtn"
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </button>
          <button
            className="primaryBtn"
            onClick={() => {
              try {
                Promise.resolve(
                  updateContacts(selectedRow?.key, {
                    values: listContacts?.filter((contact) => contact),
                  })
                )
                  .then(() => {
                    callApi();
                  })
                  .catch(console.log);
                handleClose();
              } catch (error) {
                console.log(error);
              }
            }}
          >
            Save Change
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className="flex justifyBetween alignCenter">
          <small className="fade">Contact Address</small>
          {type !== ContactTypes.TELEGRAM && (
            <small className="fade">Action</small>
          )}
          {type === ContactTypes.TELEGRAM && (
            <div className="flex gap10">
              <small>Blue Check</small>
              <small className="fade">Action</small>
            </div>
          )}
        </div>
      </div>

      {listContacts?.map((contact, index) => {
        return (
          <div className={styles.item} key={index}>
            <Input
              type="text"
              className="input"
              placeholder="Enter contact address"
              // @ts-ignore
              value={type === ContactTypes.TELEGRAM ? contact?.data : contact}
              onChange={(e) => {
                if (type === ContactTypes.TELEGRAM) {
                  const newListContacts = [...listContacts];
                  newListContacts[index] = {
                    // @ts-ignore
                    ...contact,
                    data: e.target.value,
                  };
                  setListContacts(newListContacts);
                } else {
                  const newListContacts = [...listContacts];
                  newListContacts[index] = e.target.value;
                  setListContacts(newListContacts);
                }
              }}
            />
            {type === ContactTypes.TELEGRAM && (
              <Switch
                style={{
                  position: "absolute",
                  right: "3rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
                // @ts-ignore
                checked={contact?.blue_check}
                onChange={(checked) => {
                  const newListContacts = [...listContacts];
                  newListContacts[index] = {
                    // @ts-ignore
                    ...contact,
                    blue_check: checked,
                  };
                  setListContacts(newListContacts);
                }}
              />
            )}
            <DeleteOutlined
              onClick={() => {
                const newListContacts = [...listContacts];
                newListContacts.splice(index, 1);
                setListContacts(newListContacts);
              }}
              className={styles.iconRight}
            />
            {icon}
          </div>
        );
      })}

      <button
        className="secondaryBtn"
        style={{
          width: "100%",
          marginTop: "1rem",
        }}
        onClick={() => {
          setListContacts([...listContacts, ""]);
        }}
      >
        + Add New
      </button>
    </Modal>
  );
};

export default ModalEditContacts;
