import React from 'react';
import Icon from '@ant-design/icons';
import Lock from '../../resources/img/svg/lock.svg?react';

const CustomLockIcon = (props: React.HTMLAttributes<HTMLSpanElement>) => {
    return <Icon component={Lock} {...props} />;
};

export default CustomLockIcon;
