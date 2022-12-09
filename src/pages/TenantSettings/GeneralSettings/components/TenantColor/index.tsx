import { useTranslation } from 'react-i18next';
import { CardEditable } from '../../../../../components/CardEditable';
import { FormColorSelectorField } from '../../../../../components/FormColorSelectorField';
import { useTenantAdminData } from '../../../../../hooks/useTenantAdminData.hook';
import { useTenantAdminDataMutation } from '../../../../../hooks/useTenantAdminDataMutation.hook';

export const TenantColor = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useTenantAdminData();
    const { mutate } = useTenantAdminDataMutation();

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{ ...data }}
            titleKey="settings.colors"
            subTitle={t('settings.colors.howto')}
            onSave={mutate}
        >
            <FormColorSelectorField labelKey="organisation.primaryColor" name={['theming', 'primaryColor']} />
        </CardEditable>
    );
};
