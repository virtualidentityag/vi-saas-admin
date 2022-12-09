import { ChevronLeft } from '@mui/icons-material';
import { Divider, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import Title from 'antd/es/typography/Title';
import { CardEditable } from '../../../components/CardEditable';
import { Button, BUTTON_TYPES } from '../../../components/button/Button';
import { FormInputField } from '../../../components/FormInputField';
import { FormTextAreaField } from '../../../components/FormTextAreaField';
import { Page } from '../../../components/Page';
import { useAddOrUpdateTopicAdmin } from '../../../hooks/useAddOrUpdateTopicAdmin.hook';
import { FormSwitchField } from '../../../components/FormSwitchField';
import { TranslatableFormField } from '../../../components/TranslatableFormField';
import { useTopicAdmin } from '../../../hooks/useTopicAdmin';

export const TopicEditOrAdd = () => {
    const navigate = useNavigate();
    const [form] = useForm();
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();

    const isEditing = id !== 'add';
    const { data: topic, isLoading } = useTopicAdmin({ id, enabled: isEditing });

    const { mutate } = useAddOrUpdateTopicAdmin({
        id: isEditing ? id : null,
        onSuccess: (response) => {
            message.success({
                content: t(`message.topic.${isEditing ? 'update' : 'add'}`),
                duration: 3,
            });
            navigate(`/admin/topics/${response?.id || id}`);
        },
    });

    const onSave = useCallback((data) => mutate(data), []);
    const onCancel = useCallback(() => navigate(`/admin/topics`), []);

    return (
        <Page isLoading={isLoading}>
            <div className="agencyEdit__headerBack">
                <NavLink to="/admin/topics">
                    <ChevronLeft />
                    <h3 className="agencyEdit__header--headline">
                        {t(isEditing ? 'topic.modal.headline.edit' : 'topic.modal.headline.add')}
                    </h3>
                </NavLink>
            </div>

            <CardEditable
                isLoading={isLoading}
                initialValues={{
                    ...(topic || {}),
                    status: topic?.status === 'ACTIVE',
                    name: {
                        ...(topic?.name || {}),
                    },
                    description: {
                        ...(topic?.description || {}),
                    },
                }}
                titleKey="topics.settings"
                onSave={onSave}
                onAddMode={!isEditing}
                formProp={form}
            >
                <FormInputField
                    name="internalIdentifier"
                    labelKey="topic.internalIdentifier"
                    placeholderKey="placeholder.topic.internalIdentifier"
                    required
                    rules={[{ max: 50 }]}
                />

                <FormSwitchField
                    name="status"
                    labelKey="status"
                    checkedKey="status.ACTIVE.tooltip"
                    unCheckedKey="status.INACTIVE.tooltip"
                    required
                />

                <Divider />

                <Title level={5}>{t('topics.nameAndDescription')}</Title>
                <TranslatableFormField name="name">
                    <FormInputField
                        labelKey="topic.name"
                        placeholderKey="placeholder.topic.name"
                        required
                        rules={[{ max: 100 }]}
                    />
                </TranslatableFormField>

                <TranslatableFormField name="description">
                    <FormTextAreaField
                        labelKey="topic.description"
                        placeholderKey="placeholder.topic.description"
                        required
                        rules={[{ max: 200 }]}
                    />
                </TranslatableFormField>
            </CardEditable>

            {!isEditing && (
                <div className="agencyAdd_actions agencyAdd_actions--sticky">
                    <Button
                        item={{ label: t('agency.add.general.cancel'), type: BUTTON_TYPES.SECONDARY }}
                        buttonHandle={onCancel}
                    />
                    <Button
                        item={{ label: t('agency.add.general.save'), type: BUTTON_TYPES.PRIMARY }}
                        buttonHandle={() => form.submit()}
                    />
                </div>
            )}
        </Page>
    );
};
