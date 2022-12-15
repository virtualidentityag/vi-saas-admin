import set from 'lodash.set';
import { useCallback, useState } from 'react';
import { CardEditable } from '../../../../../components/CardEditable';
import { FormRichTextEditorField } from '../../../../../components/FormRichTextEditorField';
import { Modal, ModalProps } from '../../../../../components/Modal';
import { TranslatableFormField } from '../../../../../components/TranslatableFormField';
import { useTenantAdminData } from '../../../../../hooks/useTenantAdminData.hook';
import { useTenantAdminDataMutation } from '../../../../../hooks/useTenantAdminDataMutation.hook';
import styles from './styles.module.scss';

interface LegalTextProps {
    fieldName: string[];
    titleKey: string;
    subTitle: string | React.ReactChild;
    placeHolderKey: string;
    showConfirmationModal?: Omit<ModalProps, 'onClose' | 'onConfirm'> & { field: string[] };
}

export const LegalText = ({ fieldName, titleKey, subTitle, placeHolderKey, showConfirmationModal }: LegalTextProps) => {
    const { data, isLoading } = useTenantAdminData();
    const { mutate: updateTenant } = useTenantAdminDataMutation();
    const [formDataContent, setFormData] = useState<Record<string, unknown>>();
    const [modalVisible, setModalVisible] = useState(false);

    const onConfirm = useCallback(() => {
        updateTenant(set(formDataContent, showConfirmationModal.field, false));
        setModalVisible(false);
    }, [formDataContent]);

    const onCancel = useCallback(() => {
        updateTenant(set(formDataContent, showConfirmationModal.field, true));
        setModalVisible(false);
    }, [formDataContent]);

    return (
        <>
            <CardEditable
                allowUnsavedChanges
                isLoading={isLoading}
                initialValues={{ ...data }}
                titleKey={titleKey}
                subTitle={subTitle}
                className={styles.card}
                onSave={(formData) => {
                    if (showConfirmationModal) {
                        setFormData(formData as Record<string, unknown>);
                        setModalVisible(true);
                    } else {
                        updateTenant(formData);
                    }
                }}
            >
                <TranslatableFormField name={fieldName}>
                    <FormRichTextEditorField placeholderKey={placeHolderKey} required />
                </TranslatableFormField>
            </CardEditable>
            {showConfirmationModal && modalVisible && (
                <Modal {...showConfirmationModal} onConfirm={onConfirm} onClose={onCancel} />
            )}
        </>
    );
};
