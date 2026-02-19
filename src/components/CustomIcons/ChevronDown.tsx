import React from 'react';
import Icon from '@ant-design/icons';
import ChevronDown from '../../resources/img/svg/chevron-down.svg?react';

const CustomChevronDownIcon = (props: any) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Icon component={ChevronDown} {...props} />;
};

export default CustomChevronDownIcon;
