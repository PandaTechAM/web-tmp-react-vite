import { Layout } from 'antd'
import { Outlet } from 'react-router-dom'

const { Header, Content, Footer } = Layout

const AppLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        React Vite Template
      </Header>
      <Content style={{ padding: 24 }}>
        <Outlet />
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        Pandatech &copy; {new Date().getFullYear()}
      </Footer>
    </Layout>
  )
}

export default AppLayout
