import { api } from 'api/api'

interface Example {
  id: number
  title: string
}

export const exampleApi = api.injectEndpoints({
  endpoints: builder => ({
    getExamples: builder.query<Example[], void>({
      query: () => '/examples',
    }),
  }),
})

export const { useGetExamplesQuery } = exampleApi
