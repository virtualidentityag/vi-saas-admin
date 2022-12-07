import { useTranslation } from 'react-i18next';
import { supportedLanguages } from '../../../../../appConfig';
import { CardEditable } from '../../../../../components/CardEditable';
import { SelectFormField } from '../../../../../components/SelectFormField';
import { useTenantAdminData } from '../../../../../hooks/useTenantAdminData.hook';
import { useTenantAdminDataMutation } from '../../../../../hooks/useTenantAdminDataMutation.hook';

export const Languages = () => {
    const { t } = useTranslation();
    const { data, isLoading } = useTenantAdminData();
    const { mutate } = useTenantAdminDataMutation();
    const options = supportedLanguages.map((language) => ({ value: language, label: t(`language.${language}`) }));

    return (
        <CardEditable
            isLoading={isLoading}
            initialValues={{ ...data }}
            titleKey="organisations.language"
            subTitle={t('organisations.languageSubtitle')}
            onSave={mutate}
        >
            <SelectFormField isMulti name={['settings', 'activeLanguages']} options={options} required />
        </CardEditable>
    );
};
