import { CaseReducerActions } from "@reduxjs/toolkit";
export type Dispatchers<T extends CaseReducerActions<any, any>> = {
  [key in keyof T]: T[key] extends (...params: any[]) => any
    ? (...params: Parameters<T[key]>) => void
    : () => void;
};
export type FetchArgs = {
  url: string;
  method?:
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE"
    | "PATCH";
  body?: any;
  headers?: HeadersInit;
  redirect?: RequestRedirect;
  credentials?: RequestCredentials;
  cache?: RequestCache;
  referrer?: string;
  referrerPolicy?: ReferrerPolicy;
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal | null;
  window?: any;
};

export type BaseQueryExtraOptions = {
  signal?: AbortSignal;
};
