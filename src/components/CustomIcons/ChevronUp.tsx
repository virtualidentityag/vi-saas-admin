import React from 'react';
import Icon from '@ant-design/icons';
import ChevronUp from '../../resources/img/svg/chevron-up.svg?react';

const CustomChevronUpIcon = (props: any) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Icon component={ChevronUp} {...props} />;
};

export default CustomChevronUpIcon;
