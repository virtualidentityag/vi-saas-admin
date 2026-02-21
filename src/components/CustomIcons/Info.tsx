import React from 'react';
import Icon from '@ant-design/icons';
import Lock from '../../resources/img/svg/info.svg?react';

const CustomInfoIcon = (props: React.HTMLAttributes<HTMLSpanElement>) => {
    return <Icon component={Lock} {...props} />;
};

export default CustomInfoIcon;
