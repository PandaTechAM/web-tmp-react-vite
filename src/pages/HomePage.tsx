import { RocketOutlined } from '@ant-design/icons'
import { Button, Card, Space, Typography } from 'antd'

import ExampleCard from 'components/ExampleCard'

const { Title, Paragraph } = Typography

const HomePage = () => {
  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Title level={1}>
          <RocketOutlined /> Welcome
        </Title>
        <Paragraph>
          This is the Pandatech React + Vite template. Router, Redux Toolkit
          (with RTK Query), and Ant Design are wired and ready. Delete this page
          and start building.
        </Paragraph>
        <Button type="primary">Primary action</Button>
      </Card>

      <ExampleCard />
    </Space>
  )
}

export default HomePage
