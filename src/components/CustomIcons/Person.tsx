import React from 'react';
import Icon from '@ant-design/icons';
import PersonIcon from '../../resources/img/svg/person.svg?react';

const CustomPersonIcon = (props: React.HTMLAttributes<HTMLSpanElement>) => {
    return <Icon component={PersonIcon} {...props} />;
};

export default CustomPersonIcon;
