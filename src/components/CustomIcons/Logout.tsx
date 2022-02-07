import React from "react";
import Icon from "@ant-design/icons";
import { ReactComponent as LogoutIcon } from "../../resources/img/svg/logout.svg";

function CustomLogoutIcon(props: any) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Icon component={LogoutIcon} {...props} />;
}

export default CustomLogoutIcon;
