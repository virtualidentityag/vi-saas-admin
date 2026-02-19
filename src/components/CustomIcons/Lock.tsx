import React from 'react';
import Icon from '@ant-design/icons';
import Lock from '../../resources/img/svg/lock.svg?react';

const CustomLockIcon = (props: any) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Icon component={Lock} {...props} />;
};

export default CustomLockIcon;
