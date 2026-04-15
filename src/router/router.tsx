import { createBrowserRouter } from 'react-router-dom'

import RouteErrorBoundary from 'components/RouteErrorBoundary'
import AppLayout from 'layouts/AppLayout'

import { RouterPaths } from './paths'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: RouterPaths.Home,
        lazy: async () => {
          const { default: Component } = await import('pages/HomePage')
          return { Component }
        },
      },
      {
        path: RouterPaths.NotFound,
        lazy: async () => {
          const { default: Component } = await import('pages/NotFoundPage')
          return { Component }
        },
      },
    ],
  },
])
