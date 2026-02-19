import React from 'react';
import Icon from '@ant-design/icons';
import Lock from '../../resources/img/svg/info.svg?react';

const CustomInfoIcon = (props: any) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Icon component={Lock} {...props} />;
};

export default CustomInfoIcon;
