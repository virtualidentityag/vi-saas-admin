import { useCallback, useState } from 'react';
import { CardEditable } from '../../../../../components/CardEditable';
import { FormRichTextEditorField } from '../../../../../components/FormRichTextEditorField';
import { TranslatableFormField } from '../../../../../components/TranslatableFormField';
import { useTenantAdminData } from '../../../../../hooks/useTenantAdminData.hook';
import { useTenantAdminDataMutation } from '../../../../../hooks/useTenantAdminDataMutation.hook';
import { AskUserPermissionModal, AskUserPermissionProps } from '../AskUserConfirmation';

interface LegalTextProps {
    fieldName: string[];
    titleKey: string;
    subTitle: string | React.ReactChild;
    placeHolderKey: string;
    showConfirmationModal?: Omit<AskUserPermissionProps, 'onClose' | 'onConfirm'>;
}

export const LegalText = ({ fieldName, titleKey, subTitle, placeHolderKey, showConfirmationModal }: LegalTextProps) => {
    const { data, isLoading } = useTenantAdminData();
    const { mutate: updateTenant } = useTenantAdminDataMutation();
    const [formDataContent, setFormData] = useState<unknown>();
    const [modalVisible, setModalVisible] = useState(false);

    const onConfirm = useCallback(() => updateTenant(formDataContent), [formDataContent]);
    const onCancel = useCallback(() => {
        updateTenant(formDataContent);
        setModalVisible(false);
    }, [formDataContent]);

    return (
        <>
            <CardEditable
                isLoading={isLoading}
                initialValues={{ ...data }}
                titleKey={titleKey}
                subTitle={subTitle}
                onSave={(formData) => {
                    if (showConfirmationModal) {
                        setFormData(formData);
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
                <AskUserPermissionModal {...showConfirmationModal} onConfirm={onConfirm} onClose={onCancel} />
            )}
        </>
    );
};
