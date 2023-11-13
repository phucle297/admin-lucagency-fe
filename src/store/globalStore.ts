/* eslint-disable @typescript-eslint/no-explicit-any */
import { IContact } from "interfaces/contacts.interface";
import { IResponseDataStatus } from "interfaces/utils.interface";
import { ContactsService } from "services/contacts.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IGlobalStore {
  contacts: IContact[];
  getContacts: () => Promise<IResponseDataStatus>;
  updateContacts: (
    contactId: string,
    values: any[]
  ) => Promise<IResponseDataStatus>;
}
export const useGlobalStore = create(
  persist<IGlobalStore>(
    (set) => ({
      contacts: [],
      getContacts: async () => {
        const response = await ContactsService.getContacts();
        set({ contacts: response.data });
        return response;
      },
      updateContacts: async (contactId: string, values: any[]) => {
        const res = await ContactsService.updateContacts(contactId, values);
        set((state) => {
          const contacts = state.contacts.map((contact) => {
            if (contact._id === contactId) {
              return { ...contact, values };
            }
            return contact;
          });
          return { ...state, contacts };
        });
        return res;
      },
    }),
    {
      name: "global-storage",
      getStorage: () => localStorage,
    }
  )
);
