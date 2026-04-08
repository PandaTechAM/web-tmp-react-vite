import { App as AntdApp, ConfigProvider } from 'antd'
import { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { RouterProvider } from 'react-router-dom'

import { router } from 'router/router'
import { store } from 'store/store'
import { antdTheme } from 'styles/theme'

import './index.css'
import 'styles/reset.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element #root not found in index.html')
}

createRoot(rootElement).render(
  <Provider store={store}>
    <ConfigProvider theme={antdTheme}>
      <AntdApp>
        <Suspense fallback={null}>
          <RouterProvider router={router} />
        </Suspense>
      </AntdApp>
    </ConfigProvider>
  </Provider>
)
