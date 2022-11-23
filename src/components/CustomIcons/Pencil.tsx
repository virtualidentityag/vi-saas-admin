import React from 'react';
import Icon from '@ant-design/icons';
import { ReactComponent as Pencil } from '../../resources/img/svg/pencil.svg';

const CustomPencilIcon = (props: any) => {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Icon component={Pencil} {...props} />;
};

export default CustomPencilIcon;
