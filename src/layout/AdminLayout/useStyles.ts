import { useToken } from "hooks";

export const useStyles = () => {
  const token = useToken();

  const siderStyles: React.CSSProperties = {
    overflow: "auto",
    height: token.fullHeight,
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    background: token.colorWhite,
  };
  return {
    siderStyles,
  };
};
