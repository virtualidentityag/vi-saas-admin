import { Form, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useFeatureContext } from '../../../../../context/FeatureContext';
import { FeatureFlag } from '../../../../../enums/FeatureFlag';
import { Gender } from '../../../../../enums/Gender';
import { convertToOptions } from '../../../../../utils/convertToOptions';
import { Option, SelectFormField } from '../../../../../components/SelectFormField';
import { Card } from '../../../../../components/Card';
import { SliderFormField } from '../../../../../components/SliderFormField';
import { FormSwitchField } from '../../../../../components/FormSwitchField';
import { useTenantTopics } from '../../../../../hooks/useTenantTopics';
import { useTenantsData } from '../../../../../hooks/useTenantsData';
import { getDiocesesData } from '../../../../../api/agency/getDiocesesData';
import getConsultingTypes from '../../../../../api/consultingtype/getConsultingTypes';
import styles from './styles.module.scss';
import { CounsellingRelation } from '../../../../../enums/CounsellingRelation';
import { ReleaseToggle } from '../../../../../enums/ReleaseToggle';
import { useReleasesToggle } from '../../../../../hooks/useReleasesToggle.hook';
import { getDomain } from '../../../../../utils/getDomain';

export const AgencySettings = () => {
    const [t] = useTranslation();

    const topicIds = Form.useWatch<Option[]>('topicIds') || [];
    const genders = Form.useWatch<Option[]>(['demographics', 'genders']) || [];
    const counsellingRelations = Form.useWatch<Option[]>('counsellingRelations') || [];

    const [diocesesData, setDiocesesData] = useState([]);
    const [consultingTypes, setConsultingTypes] = useState([]);

    const { isEnabled } = useFeatureContext();
    const { isEnabled: isReleaseToggleEnabled } = useReleasesToggle();
    const { data: topics, isLoading: isLoadingTopics } = useTenantTopics(true);
    const topicsForList = topics?.filter(({ id }) => !topicIds.find(({ value }) => value === `${id}`));
    const gendersForList = Object.values(Gender).filter((name) => !genders.find(({ value }) => value === `${name}`));
    const counsellingRelationsForList = Object.values(CounsellingRelation).filter(
        (relation) => !counsellingRelations.find(({ value }) => value === `${relation}`),
    );

    const { data: tenantsData, isLoading: isLoadingTenants } = useTenantsData({ perPage: 1000 });

    useEffect(() => {
        if (isEnabled(FeatureFlag.ConsultingTypesForAgencies)) {
            getConsultingTypes().then((cTypes) => setConsultingTypes(cTypes));
            getDiocesesData().then((dioceses) => setDiocesesData(dioceses));
        }
    }, []);

    return (
        <Card isLoading={isLoadingTopics || isLoadingTenants} titleKey="agency.edit.settings.title">
            <SelectFormField
                name="tenantId"
                placeholder="tenantAdmins.form.tenant"
                required
                className={styles.select}
                label="tenantAdmins.form.tenantAssignment"
            >
                {tenantsData?.data.map((option) => (
                    <SelectFormField.Option
                        key={option.id}
                        className={styles.option}
                        value={String(option.id)}
                        label={option.name}
                    >
                        <div className={styles.optionName}>{option.name}</div>
                        <div className={styles.optionGroup}>
                            <div className={styles.optionTenantId}>{option.id}</div>
                            {' | '}
                            <div className={styles.optionTenantSubdomain}>{getDomain()}</div>
                        </div>
                    </SelectFormField.Option>
                ))}
            </SelectFormField>
            {isEnabled(FeatureFlag.Topics) && topics?.length > 0 && (
                <SelectFormField
                    label="topics.title"
                    name="topicIds"
                    labelInValue
                    isMulti
                    allowClear
                    placeholder="plsSelect"
                    options={convertToOptions(topicsForList, 'name', 'id')}
                />
            )}
            {isEnabled(FeatureFlag.ConsultingTypesForAgencies) && (
                <SelectFormField
                    label="agency.edit.general.more_settings.diocese.title"
                    name="dioceseId"
                    placeholder="plsSelect"
                    options={convertToOptions(diocesesData, ['id', 'name'], 'id')}
                />
            )}
            {isEnabled(FeatureFlag.ConsultingTypesForAgencies) && (
                <SelectFormField
                    label="agency"
                    name="consultingType"
                    placeholder="plsSelect"
                    options={convertToOptions(consultingTypes, ['id', 'titles.default'], 'id')}
                />
            )}
            {isEnabled(FeatureFlag.Demographics) && (
                <>
                    <SliderFormField
                        className={styles.sliderContainer}
                        label="agency.age"
                        name={['demographics', 'age']}
                        min={0}
                        max={100}
                    />
                    <SelectFormField
                        required
                        placeholder={t('select.placeholder')}
                        labelInValue
                        label="agency.gender"
                        name={['demographics', 'genders']}
                        isMulti
                        options={gendersForList.map((gender) => ({
                            value: gender,
                            label: t(`agency.gender.option.${gender.toLowerCase()}`),
                        }))}
                    />
                </>
            )}

            {isReleaseToggleEnabled(ReleaseToggle.COUNSELLING_RELATIONS) && (
                <SelectFormField
                    required
                    placeholder={t('select.placeholder')}
                    labelInValue
                    label="agency.relation"
                    name="counsellingRelations"
                    isMulti
                    options={counsellingRelationsForList.map((relation) => ({
                        value: relation,
                        label: t(`agency.relation.option.${relation.replace('_COUNSELLING', '').toLowerCase()}`),
                    }))}
                />
            )}

            <FormSwitchField
                inline
                disableLabels
                labelKey="agency.form.settings.teamAdviceCenter.title"
                name="teamAgency"
            />

            <Typography.Paragraph>{t('agency.form.settings.teamAdviceCenter.description')}</Typography.Paragraph>
        </Card>
    );
};
