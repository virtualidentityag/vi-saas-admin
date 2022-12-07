import { Form, FormInstance, Spin } from 'antd';
import Title from 'antd/lib/typography/Title';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '../box/Box';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import Pencil from '../CustomIcons/Pencil';
import { Tooltip } from '../tooltip/Tooltip';
import styles from './styles.module.scss';
import { ReactComponent as InfoIcon } from '../../resources/img/svg/i.svg';

interface CardEditableProps {
    className?: string;
    isLoading?: boolean;
    initialValues: Record<string, unknown>;
    titleKey: string;
    subTitle?: React.ReactChild;
    children:
        | React.ReactElement
        | React.ReactElement[]
        | ((form: FormInstance<any>) => React.ReactElement | React.ReactElement[]);
    onSave: <T>(formData: T) => void;
    formProp?: FormInstance;
    onAddMode?: boolean;
    tooltip?: React.ReactChild;
}

export const CardEditable = ({
    className,
    isLoading,
    initialValues,
    titleKey,
    subTitle,
    children,
    onAddMode,
    onSave,
    formProp,
    tooltip,
}: CardEditableProps) => {
    const [form] = Form.useForm(formProp);
    const { t } = useTranslation();
    const [editing, setEditing] = useState(onAddMode);
    const cancelEditButton: ButtonItem = {
        label: t('agency.edit.general.general_information.cancel'),
        type: BUTTON_TYPES.LINK,
    };

    const saveEditButton: ButtonItem = {
        label: t('agency.edit.general.general_information.save'),
        type: BUTTON_TYPES.LINK,
    };

    const onFormSubmit = useCallback(
        (formData) => {
            onSave(formData);
            setEditing(false);
        },
        [onSave],
    );

    return (
        <Box className={styles.card} contentClassName={styles.contentClassName}>
            <div className={classNames(styles.cardTitle, className)}>
                <div className={styles.titleContainer}>
                    <Title className={classNames(styles.title)} level={5}>
                        {t(titleKey)}
                    </Title>

                    {tooltip && (
                        <Tooltip className={styles.tooltip} trigger={<InfoIcon fill="var(--primary)" />}>
                            {tooltip}
                        </Tooltip>
                    )}
                </div>
                {!onAddMode && <Pencil className={styles.pencil} onClick={() => setEditing(true)} />}
            </div>
            {subTitle && <div className={classNames(styles.cardSubTitle)}>{subTitle}</div>}
            <div className={classNames(styles.container, { [styles.isLoading]: isLoading })}>
                {isLoading && <Spin />}
                {!isLoading && (
                    <Form
                        size="small"
                        labelAlign="left"
                        labelWrap
                        layout="vertical"
                        form={form}
                        onFinish={onFormSubmit}
                        disabled={!editing}
                        initialValues={initialValues}
                    >
                        {typeof children === 'function' ? children(form) : children}
                    </Form>
                )}
            </div>

            {editing && !onAddMode && (
                <div className={styles.footerActions}>
                    <Button
                        item={cancelEditButton}
                        buttonHandle={() => {
                            form.resetFields();
                            setEditing(false);
                        }}
                    />
                    <Button item={saveEditButton} buttonHandle={() => form.submit()} />
                </div>
            )}
        </Box>
    );
};
