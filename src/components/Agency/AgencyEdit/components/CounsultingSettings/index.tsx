import { Col, Form, message, Row } from 'antd';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useFeatureContext } from '../../../../../context/FeatureContext';
import { FeatureFlag } from '../../../../../enums/FeatureFlag';
import { Gender } from '../../../../../enums/Gender';
import { useAgencyData } from '../../../../../hooks/useAgencyData';
import { useAgencyUpdate } from '../../../../../hooks/useAgencyUpdate';
import { useAgencyHasConsultants } from '../../../../../hooks/useAgencyHasConsultants';
import { useTopics } from '../../../../../hooks/useTopics';
import { TopicData } from '../../../../../types/topic';
import { convertToOptions } from '../../../../../utils/convertToOptions';
import { FormSwitchField } from '../../../../FormSwitchField';
import { Option, SelectFormField } from '../../../../SelectFormField';
import { SliderFormField } from '../../../../SliderFormField';
import { CardEditable } from '../../../../CardEditable';

const DEFAULT_MIN_AGE = 18;
const DEFAULT_MAX_AGE = 100;

interface ConsultingSettingsContainerProps {
    topics: TopicData[];
    hasConsultants: boolean;
}

const ConsultingSettingsContainer = ({ topics, hasConsultants }: ConsultingSettingsContainerProps) => {
    const [t] = useTranslation();
    const topicIds = Form.useWatch<Option[]>('topicIds') || [];
    const genders = Form.useWatch<Option[]>(['demographics', 'genders']) || [];

    const { isEnabled } = useFeatureContext();
    const topicsForList = topics.filter(({ id }) => !topicIds.find(({ value }) => value === `${id}`));
    const gendersForList = Object.values(Gender).filter((name) => !genders.find(({ value }) => value === `${name}`));

    return (
        <>
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
            <Row gutter={[20, 10]}>
                <Col xs={12} lg={6}>
                    <FormSwitchField
                        labelKey="agency.edit.general.more_settings.team_advice_center"
                        name="teamAgency"
                        paragraphKey="yes"
                    />
                </Col>
                <Col xs={12} lg={6}>
                    <FormSwitchField
                        labelKey="agency.edit.general.more_settings.online"
                        name="online"
                        disabled={!hasConsultants}
                        paragraphKey="yes"
                    />
                </Col>
            </Row>

            {isEnabled(FeatureFlag.Demographics) && (
                <>
                    <SliderFormField label="agency.age" name={['demographics', 'age']} min={0} max={100} />
                    <SelectFormField
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
        </>
    );
};

export const ConsultingSettings = ({ id }: { id: string }) => {
    const [t] = useTranslation();
    const { data: hasConsultants, isLoading: isLoadingConsultants } = useAgencyHasConsultants({ id });
    const { mutate } = useAgencyUpdate(id);
    const { isEnabled } = useFeatureContext();
    const { data, isLoading, refetch } = useAgencyData({ id });
    const { data: topics, isLoading: isLoadingTopics } = useTopics(true);

    const demographicsInitialValues = isEnabled(FeatureFlag.Demographics)
        ? {
              demographics: {
                  age:
                      data?.demographics?.ageFrom !== undefined
                          ? [data.demographics.ageFrom, data.demographics.ageTo]
                          : [DEFAULT_MIN_AGE, DEFAULT_MAX_AGE],
                  genders: (data?.demographics?.genders || Object.values(Gender)).map((gender) => ({
                      value: gender,
                      label: t(`agency.gender.option.${gender.toLowerCase()}`),
                  })),
              },
          }
        : {};

    const saveInfo = useCallback((formData) => {
        const newFormData = {
            ...formData,
            demographics: formData.demographics && {
                ageFrom: formData.demographics.age[0],
                ageTo: formData.demographics.age[1],
                genders: formData.demographics.genders.map(({ value }) => value),
            },
            topicIds: formData.topicIds.map(({ value }) => value),
            offline: !formData.online,
        };
        mutate(newFormData, {
            onSuccess: () => {
                refetch();
                message.success({
                    content: t('message.agency.update'),
                    duration: 3,
                });
            },
        });
    }, []);

    return (
        <CardEditable
            isLoading={isLoading || isLoadingTopics || isLoadingConsultants}
            initialValues={{
                ...data,
                ...demographicsInitialValues,
                online: !data?.offline,
                topicIds: convertToOptions(data?.topics, 'name', 'id', true),
            }}
            titleKey="agency.edit.general.more_settings"
            onSave={saveInfo}
        >
            <ConsultingSettingsContainer topics={topics} hasConsultants={hasConsultants} />
        </CardEditable>
    );
};
