import React from 'react';
import Icon from '@ant-design/icons';
import ChevronDown from '../../resources/img/svg/chevron-down.svg?react';

const CustomChevronDownIcon = (props: React.HTMLAttributes<HTMLSpanElement>) => {
    return <Icon component={ChevronDown} {...props} />;
};

export default CustomChevronDownIcon;
