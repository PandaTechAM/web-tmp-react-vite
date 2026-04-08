import { Card, Typography } from 'antd'

const { Paragraph, Text } = Typography

const ExampleCard = () => {
  return (
    <Card title="Pre-installed packages">
      <Paragraph>
        <Text strong>react 19</Text>, <Text strong>react-router 7</Text>,{' '}
        <Text strong>@reduxjs/toolkit + RTK Query</Text>,{' '}
        <Text strong>antd 6</Text>, <Text strong>@ant-design/icons</Text>,{' '}
        <Text strong>classnames</Text>, <Text strong>dompurify</Text>,{' '}
        <Text strong>async-mutex</Text>.
      </Paragraph>
      <Paragraph>
        See <Text code>README.md</Text> for the full list and what to remove
        before starting your project.
      </Paragraph>
    </Card>
  )
}

export default ExampleCard
