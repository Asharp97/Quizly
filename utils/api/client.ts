import type { FetchOptions } from "ofetch";

export default class Client {
  options?: FetchOptions;
  url: string;

  constructor(url: string, options?: FetchOptions) {
    this.url = url;
    this.options = options;
  }

  async raw(query: string, variables?: Record<string, any>): Promise<any> {
    const response = await $fetch.raw(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.options?.headers,
      },
      body: {
        query,
        variables,
      },
    });
    return response._data;
  }

  async query<T>(query: string, variables?: Record<string, any>): Promise<T> {
    const response = await $fetch<T>(this.url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...this.options?.headers,
      },
      body: {
        query,
        variables,
      },
    });
    return response;
  }

  async mutate<T>(
    mutation: string,
    variables?: Record<string, any>
  ): Promise<T> {
    const response = await $fetch<T>(this.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.options?.headers,
      },
      body: {
        query: mutation,
        variables,
      },
    });
    return response;
  }
}
