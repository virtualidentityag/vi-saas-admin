import React from 'react';
import Icon from '@ant-design/icons';
import Verified from '../../resources/img/svg/verified.svg?react';

const CustomVerifiedIcon = (props: React.HTMLAttributes<HTMLSpanElement>) => {
    return <Icon component={Verified} {...props} />;
};

export default CustomVerifiedIcon;
