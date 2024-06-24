import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { BaseQueryExtraOptions, FetchArgs } from "types";

interface ErrorData {
  message?: string;
}
type Result = ReturnType<typeof baseQuery>;

const mutex = new Mutex();

const baseUrl = "https://api.example.com/";
export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers, { getState }) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("token", token);
    }

    return headers;
  },
});

export const baseQueryWithReauth = async (
  args: FetchArgs,
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions
) => {
  await mutex.waitForUnlock();
  let result: Result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 500) {
    console.log("error");
  }

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const authResult = await baseQuery("/refreshToken", api, extraOptions);
        if (authResult?.data) {
          // retry the initial query
          result = await baseQuery(args, api, extraOptions);
        } else {
          console.log("redircet");
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};
export const api = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
