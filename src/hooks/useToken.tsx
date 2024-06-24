import { theme } from "antd";
import type { GlobalToken } from "antd";
type Token = GlobalToken & {
  fullHeight: string;
};
export const useToken = (): Token => {
  const { token } = theme.useToken();
  return token as Token;
};
