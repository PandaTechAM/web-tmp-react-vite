import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

import { RouterPaths } from 'router/paths'

const NotFoundPage = () => {
  const navigate = useNavigate()

  return (
    <Result
      extra={
        <Button
          type="primary"
          onClick={() => {
            void navigate(RouterPaths.Home)
          }}
        >
          Go home
        </Button>
      }
      status="404"
      subTitle="The page you are looking for does not exist."
      title="404"
    />
  )
}

export default NotFoundPage
