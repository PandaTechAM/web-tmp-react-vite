export const RouterPaths = {
  Home: '/',
  NotFound: '*',
} as const

export type RouterPath = (typeof RouterPaths)[keyof typeof RouterPaths]
