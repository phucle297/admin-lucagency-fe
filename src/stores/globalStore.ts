/* eslint-disable @typescript-eslint/no-explicit-any */
import { IContact } from "@interfaces/contacts.interface";
import { IPost } from "@interfaces/posts.interface";
import { IProduct } from "@interfaces/products.interface";
import { IUser } from "@interfaces/users.interface";
import { IResponseDataStatus } from "@interfaces/utils.interface";
import { AuthService } from "@services/auth.service";
import { ContactsService } from "@services/contacts.service";
import { PostsService } from "@services/posts.service";
import { ProductsService } from "@services/product.service";
import { UsersService } from "@services/users.service";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IGlobalStore {
  whoAmI: any;
  contacts: IContact[];
  users: IUser[];
  products: IProduct[];
  posts: IPost[];
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
    search: string,
    role?: string
  ) => Promise<IResponseDataStatus>;
  getPosts: (
    page: number,
    limit: number,
    search: string | undefined,
    state: string | undefined,
    hot_topic: boolean | undefined,
    language: string | undefined
  ) => Promise<IResponseDataStatus>;
  deletePost: (postId: string) => Promise<IResponseDataStatus>;
  getWhoAmI: () => Promise<IResponseDataStatus>;
}
export const useGlobalStore = create(
  persist<IGlobalStore>(
    (set) => ({
      whoAmI: {},
      users: [],
      contacts: [],
      products: [],
      posts: [],
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
      getUsers: async (
        page: number,
        limit: number,
        search: string,
        role?: string
      ) => {
        const res = await UsersService.getUsers(page, limit, search, role);
        set({ products: res.data });
        return res;
      },
      getPosts: async (
        page: number,
        limit: number,
        search: string | undefined,
        state: string | undefined,
        hot_topic: boolean | undefined,
        language: string | undefined
      ) => {
        const res = await PostsService.getPosts(
          page,
          limit,
          search,
          state,
          hot_topic,
          language
        );
        set({ posts: res.data });
        return res;
      },
      deletePost: async (postId: string) => {
        const res = await PostsService.deletePostById(postId);
        set((state) => {
          const posts = state.posts.filter((post) => post._id !== postId);
          return { ...state, posts };
        });
        return res;
      },
      getWhoAmI: async () => {
        const res = await AuthService.whoAmI();
        set({ whoAmI: res.data });
        return res;
      },
    }),
    {
      name: "global-storage",
      getStorage: () => localStorage,
    }
  )
);
