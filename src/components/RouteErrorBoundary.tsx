import { Button, Result } from 'antd'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

const resolveError = (error: unknown) => {
  if (isRouteErrorResponse(error)) {
    return {
      status: error.status,
      subTitle: error.statusText || 'Unexpected route error.',
    }
  }
  if (error instanceof Error) {
    return { status: 500, subTitle: error.message }
  }
  return { status: 500, subTitle: 'Unexpected route error.' }
}

const RouteErrorBoundary = () => {
  const error = useRouteError()
  const { status, subTitle } = resolveError(error)

  return (
    <Result
      extra={
        <Button
          type="primary"
          onClick={() => {
            window.location.assign('/')
          }}
        >
          Reload
        </Button>
      }
      status={status === 404 ? '404' : '500'}
      subTitle={subTitle}
      title={String(status)}
    />
  )
}

export default RouteErrorBoundary
