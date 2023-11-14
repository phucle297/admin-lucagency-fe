/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPost } from "@interfaces/posts.interface";
import HttpInterceptor from "utils/HttpInterceptor";

export class PostsService {
  public static async getPosts(
    page: number,
    limit: number,
    search: string | undefined,
    state: string | undefined,
    hot_topic: boolean | undefined,
    language: string | undefined
  ) {
    const params = {
      page,
      limit,
      search,
      state,
      hot_topic,
      language,
    };
    if (search === undefined) {
      delete params.search;
    }
    if (state === undefined) {
      delete params.state;
    }
    if (hot_topic === undefined) {
      delete params.hot_topic;
    }
    if (language === undefined) {
      delete params.language;
    }

    const response = await HttpInterceptor.get("/posts", {
      params: { ...params },
    });
    return response;
  }
  public static async createPost({ ...params }: IPost) {
    const response = await HttpInterceptor.post("/posts", { ...params });
    return response;
  }
  public static async saveContentFile(
    id: string,
    language: "CN" | "EN",
    file: FormData
  ) {
    const response = await HttpInterceptor.post(
      `/posts/content/${id}?language=${language}`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }
  public static async updateContentFile(
    id: string,
    language: "CN" | "EN",
    file: FormData
  ) {
    const response = await HttpInterceptor.patch(
      `/posts/content/${id}?language=${language}`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }
  public static async uploadThumbnails(id: string, file: FormData) {
    const response = await HttpInterceptor.patch(
      `/posts/thumbnail/${id}`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  }
  public static async getPostById(id: string) {
    const response = await HttpInterceptor.get(`/posts/${id}`);
    return response;
  }
  public static async updatePostById(id: string, { ...params }: IPost) {
    const response = await HttpInterceptor.patch(`/posts/${id}`, {
      ...params,
    });
    return response;
  }
  public static async deletePostById(id: string) {
    const response = await HttpInterceptor.delete(`/posts/${id}`);
    return response;
  }
}
