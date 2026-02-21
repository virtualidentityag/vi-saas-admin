import { Button as AntButton, Form, FormInstance } from 'antd';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { EditOutlined } from '@ant-design/icons';
import { UnsavedChangesModal } from './components/UnsavedChanges';
import styles from './styles.module.scss';
import { Card } from '../Card';

interface CardEditableProps {
    className?: string;
    isLoading?: boolean;
    fullHeight?: boolean;
    initialValues?: Record<string, unknown>;
    titleKey: string;
    subTitle?: React.ReactChild;
    subTitleKey?: string;
    saveKey?: string;
    cancelKey?: string;
    children:
        | React.ReactElement
        | React.ReactElement[]
        | ((data: { form: FormInstance<any>; editing: boolean }) => React.ReactElement | React.ReactElement[]);
    onSave: <T>(formData: T, options?: { onError?: () => void }) => void;
    formProp?: FormInstance;
    editMode?: boolean;
    hideSaveButton?: boolean;
    hideCancelButton?: boolean;
    tooltip?: string;
    allowUnsavedChanges?: boolean;
    editButton?: React.ReactChild;
}

export const CardEditable = ({
    allowUnsavedChanges,
    className,
    isLoading,
    initialValues,
    titleKey,
    subTitle,
    subTitleKey,
    cancelKey = 'card.edit.cancel',
    saveKey = 'card.edit.save',
    children,
    editMode,
    hideSaveButton,
    hideCancelButton,
    onSave,
    formProp,
    tooltip,
    fullHeight,
    editButton = <EditOutlined className={styles.pencil} />,
}: CardEditableProps) => {
    const [form] = Form.useForm(formProp);
    const { t } = useTranslation();
    const [editing, setEditing] = useState(editMode);
    const [hasChanges, setHasChanges] = useState(false);
    const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

    const onFormSubmit = useCallback(
        (formData) => {
            onSave(formData, { onError: () => setEditing(editMode) });
            setEditing(editMode);
            setHasChanges(false);
        },
        [onSave],
    );

    return (
        <Card
            className={classNames(styles.card, className, { [styles.fullHeight]: fullHeight })}
            titleKey={titleKey}
            subTitle={subTitle}
            subTitleKey={subTitleKey}
            tooltip={tooltip}
            isLoading={isLoading}
            cardTitleClassName={styles.cardTitleClassName}
            cardTitleChildren={
                !editMode &&
                !editing && (
                    <button className={styles.editCard} type="button" onClick={() => setEditing(true)}>
                        {editButton}
                    </button>
                )
            }
        >
            <Form
                validateTrigger={['onSubmit', 'onChange']}
                labelAlign="left"
                labelWrap
                layout="vertical"
                form={form}
                size="large"
                onValuesChange={() => setHasChanges(true)}
                onFinish={onFormSubmit}
                disabled={!editing}
                initialValues={initialValues}
            >
                {typeof children === 'function' ? children({ form, editing }) : children}
            </Form>

            {editing && (!hideSaveButton || !hideCancelButton) && (
                <div className={styles.footerActions}>
                    {!hideCancelButton && (
                        <AntButton
                            type="default"
                            onClick={() => {
                                if (allowUnsavedChanges && hasChanges) {
                                    setShowUnsavedChangesModal(true);
                                } else {
                                    form.resetFields();
                                    setEditing(false);
                                }
                            }}
                        >
                            {t(cancelKey)}
                        </AntButton>
                    )}
                    {!hideSaveButton && (
                        <AntButton type="primary" onClick={() => form.submit()}>
                            {t(saveKey)}
                        </AntButton>
                    )}
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
        </Card>
    );
};
