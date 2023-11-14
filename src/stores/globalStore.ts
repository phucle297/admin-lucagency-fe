/* eslint-disable @typescript-eslint/no-explicit-any */
import { IContact } from "@interfaces/contacts.interface";
import { IProduct } from "@interfaces/products.interface";
import { IUser } from "@interfaces/users.interface";
import { IResponseDataStatus } from "@interfaces/utils.interface";
import { ContactsService } from "@services/contacts.service";
import { ProductsService } from "@services/product.service";
import { UsersService } from "@services/users.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IGlobalStore {
  contacts: IContact[];
  users: IUser[];
  products: IProduct[];
  getContacts: () => Promise<IResponseDataStatus>;
  updateContacts: (
    contactId: string,
    { ...params }
  ) => Promise<IResponseDataStatus>;
  getProducts: (page: number, limit: number) => Promise<IResponseDataStatus>;
  createProduct: (body: IProduct) => Promise<IResponseDataStatus>;
  deleteProduct: (listProductIds: string[]) => Promise<IResponseDataStatus>;
  updateProduct: (productId: string, { ...params }) => Promise<any>;
  getUsers: (
    page: number,
    limit: number,
    role?: string
  ) => Promise<IResponseDataStatus>;
}
export const useGlobalStore = create(
  persist<IGlobalStore>(
    (set) => ({
      users: [],
      contacts: [],
      products: [],
      getContacts: async () => {
        const response = await ContactsService.getContacts();
        set({ contacts: response.data });
        return response;
      },
      updateContacts: async (contactId: string, { ...params }) => {
        const res = await ContactsService.updateContacts(contactId, {
          ...params,
        });
        set((state) => {
          const contacts = state.contacts.map((contact) => {
            if (contact._id === contactId) {
              return { ...contact, ...params };
            }
            return contact;
          });
          return { ...state, contacts };
        });
        return res;
      },
      getProducts: async (page: number, limit: number) => {
        const res = await ProductsService.getProducts(page, limit);
        set({ products: res.data });
        return res;
      },
      createProduct: async (body: IProduct) => {
        const res = await ProductsService.createProduct(body);
        set((state) => {
          const products = [...state.products, res.data];
          return { ...state, products };
        });
        return res;
      },
      deleteProduct: async (listProductIds: string[]) => {
        const res = await ProductsService.deleteProduct(listProductIds);
        set((state) => {
          const products = state.products.filter(
            (product) => !listProductIds.includes(product._id)
          );
          return { ...state, products };
        });
        return res;
      },
      updateProduct: async (productId: string, { ...params }) => {
        const res = await ProductsService.updateProduct(productId, {
          ...params,
        });
        set((state) => {
          const products = state.products.map((product) => {
            if (product._id === productId) {
              return { ...product, ...params };
            }
            return product;
          });
          return { ...state, products };
        });
        return res;
      },
      getUsers: async (page: number, limit: number, role?: string) => {
        const res = await UsersService.getUsers(page, limit, role);
        set({ products: res.data });
        return res;
      },
    }),
    {
      name: "global-storage",
      getStorage: () => localStorage,
    }
  )
);
