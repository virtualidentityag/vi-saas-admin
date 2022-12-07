import { CardEditable } from '../../../../../components/CardEditable';
import { FormRichTextEditorField } from '../../../../../components/FormRichTextEditorField';
import { TranslatableFormField } from '../../../../../components/TranslatableFormField';
import { useTenantAdminData } from '../../../../../hooks/useTenantAdminData.hook';
import { useTenantAdminDataMutation } from '../../../../../hooks/useTenantAdminDataMutation.hook';

interface LegalTextProps {
    fieldName: string[];
    titleKey: string;
    subTitle: string | React.ReactChild;
    placeHolderKey: string;
}

export const LegalText = ({ fieldName, titleKey, subTitle, placeHolderKey }: LegalTextProps) => {
    const { data, isLoading } = useTenantAdminData();
    const { mutate: updateTenant } = useTenantAdminDataMutation();

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{ ...data }}
            titleKey={titleKey}
            subTitle={subTitle}
            onSave={updateTenant}
        >
            <TranslatableFormField name={fieldName}>
                <FormRichTextEditorField placeholderKey={placeHolderKey} required />
            </TranslatableFormField>
        </CardEditable>
    );
};
