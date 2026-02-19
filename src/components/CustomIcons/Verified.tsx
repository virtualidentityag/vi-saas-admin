import React from 'react';
import Icon from '@ant-design/icons';
import Verified from '../../resources/img/svg/verified.svg?react';

const CustomVerifiedIcon = (props: any) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Icon component={Verified} {...props} />;
};

export default CustomVerifiedIcon;
