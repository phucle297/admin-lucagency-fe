import { IContact } from "interfaces/contacts.interface";
import { IResponseDataStatus } from "interfaces/utils.interface";
import HttpInterceptor from "utils/HttpInterceptor";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IGlobalStore {
  contacts: IContact[];
  getContacts: () => Promise<IResponseDataStatus>;
}
export const useGlobalStore = create(
  persist<IGlobalStore>(
    (set) => ({
      contacts: [],
      getContacts: async () => {
        const response = await HttpInterceptor.get("/contacts");
        set({ contacts: response.data.data });
        return response.data;
      },
    }),
    {
      name: "global-storage",
      getStorage: () => localStorage,
    }
  )
);
