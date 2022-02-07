import React from "react";
import Icon from "@ant-design/icons";
import { ReactComponent as Bin } from "../../resources/img/svg/recycleBin.svg";

function CustomRecycleIcon(props: any) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Icon component={Bin} {...props} />;
}

export default CustomRecycleIcon;
