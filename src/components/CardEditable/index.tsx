import { Form, FormInstance, Spin } from 'antd';
import Title from 'antd/lib/typography/Title';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '../box/Box';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import Pencil from '../CustomIcons/Pencil';
import { Tooltip } from '../tooltip/Tooltip';
import { ReactComponent as InfoIcon } from '../../resources/img/svg/i.svg';
import { UnsavedChangesModal } from './components/UnsavedChanges';
import styles from './styles.module.scss';

interface CardEditableProps {
    className?: string;
    isLoading?: boolean;
    fullHeight?: boolean;
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
    allowUnsavedChanges?: boolean;
}

export const CardEditable = ({
    allowUnsavedChanges,
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
    fullHeight,
}: CardEditableProps) => {
    const [form] = Form.useForm(formProp);
    const { t } = useTranslation();
    const [editing, setEditing] = useState(onAddMode);
    const [hasChanges, setHasChanges] = useState(false);
    const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

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
            setHasChanges(false);
        },
        [onSave],
    );

    return (
        <Box
            className={classNames(styles.card, { [styles.fullHeight]: fullHeight })}
            contentClassName={styles.contentClassName}
        >
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
                {!onAddMode && !editing && <Pencil className={styles.pencil} onClick={() => setEditing(true)} />}
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
                        onValuesChange={() => setHasChanges(true)}
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
                            if (allowUnsavedChanges && hasChanges) {
                                setShowUnsavedChangesModal(true);
                            } else {
                                form.resetFields();
                                setEditing(false);
                            }
                        }}
                    />
                    <Button item={saveEditButton} buttonHandle={() => form.submit()} />
                </div>
            )}
            {allowUnsavedChanges && showUnsavedChangesModal && (
                <UnsavedChangesModal
                    onConfirm={() => setShowUnsavedChangesModal(false)}
                    onClose={() => {
                        form.resetFields();
                        setEditing(false);
                        setShowUnsavedChangesModal(false);
                    }}
                />
            )}
        </Box>
    );
};
