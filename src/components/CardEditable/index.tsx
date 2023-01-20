import { Form, FormInstance } from 'antd';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, ButtonItem, BUTTON_TYPES } from '../button/Button';
import Pencil from '../CustomIcons/Pencil';
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
    onSave: <T>(formData: T) => void;
    formProp?: FormInstance;
    onAddMode?: boolean;
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
    onAddMode,
    onSave,
    formProp,
    tooltip,
    fullHeight,
    editButton = <Pencil className={styles.pencil} />,
}: CardEditableProps) => {
    const [form] = Form.useForm(formProp);
    const { t } = useTranslation();
    const [editing, setEditing] = useState(onAddMode);
    const [hasChanges, setHasChanges] = useState(false);
    const [showUnsavedChangesModal, setShowUnsavedChangesModal] = useState(false);

    const cancelEditButton: ButtonItem = {
        label: t(cancelKey),
        type: BUTTON_TYPES.LINK,
    };

    const saveEditButton: ButtonItem = {
        label: t(saveKey),
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
        <Card
            className={classNames(styles.card, className, { [styles.fullHeight]: fullHeight })}
            titleKey={titleKey}
            subTitle={subTitle}
            subTitleKey={subTitleKey}
            tooltip={tooltip}
            isLoading={isLoading}
            cardTitleChildren={
                !onAddMode &&
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
                onValuesChange={() => setHasChanges(true)}
                onFinish={onFormSubmit}
                disabled={!editing}
                initialValues={initialValues}
            >
                {typeof children === 'function' ? children({ form, editing }) : children}
            </Form>

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
        </Card>
    );
};
