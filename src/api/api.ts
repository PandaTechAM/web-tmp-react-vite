import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
  type FetchArgs,
} from '@reduxjs/toolkit/query/react'
import { Mutex } from 'async-mutex'

import type { BaseQueryExtraOptions } from 'types'

const mutex = new Mutex()

const baseUrl = import.meta.env.VITE_BASE_URL
if (!baseUrl) {
  throw new Error(
    'VITE_BASE_URL is not set. Add it to .env.local or the build args.'
  )
}

export const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: headers => {
    const token = localStorage.getItem('token')
    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

type Result = Awaited<ReturnType<typeof baseQuery>>

export const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: BaseQueryExtraOptions
): Promise<Result> => {
  await mutex.waitForUnlock()
  let result = await baseQuery(args, api, extraOptions)

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire()
      try {
        const refreshResult = await baseQuery(
          '/auth/refresh',
          api,
          extraOptions
        )
        if (refreshResult.data) {
          result = await baseQuery(args, api, extraOptions)
        } else {
          localStorage.removeItem('token')
        }
      } finally {
        release()
      }
    } else {
      await mutex.waitForUnlock()
      result = await baseQuery(args, api, extraOptions)
    }
  }

  return result
}

export const api = createApi({
  reducerPath: 'baseApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: [],
  endpoints: () => ({}),
})
