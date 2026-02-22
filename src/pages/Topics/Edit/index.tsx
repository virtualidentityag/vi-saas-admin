import { Button, Col, message, Row } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { CardEditable } from '../../../components/CardEditable';
import { FormInputField } from '../../../components/FormInputField';
import { FormTextAreaField } from '../../../components/FormTextAreaField';
import { Page } from '../../../components/Page';
import { useAddOrUpdateTopicAdmin } from '../../../hooks/useAddOrUpdateTopicAdmin.hook';
import { FormSwitchField } from '../../../components/FormSwitchField';
import { TranslatableFormField } from '../../../components/TranslatableFormField';
import { useTopicAdmin } from '../../../hooks/useTopicAdmin';

export const TopicEditOrAdd = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = id !== 'add';
    const [form] = useForm();
    const [formSettings] = useForm(isEditing ? undefined : form);
    const { t } = useTranslation();
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
            <Page.Back
                path="/admin/topics"
                titleKey={isEditing ? 'topic.modal.headline.edit' : 'topic.modal.headline.add'}
            />

            <Row gutter={[24, 24]}>
                <Col span={12}>
                    <CardEditable
                        isLoading={isLoading}
                        initialValues={{
                            ...(topic || {}),
                            status: topic?.status === 'ACTIVE' || !topic,
                            name: {
                                ...(topic?.name || {}),
                            },
                            description: {
                                ...(topic?.description || {}),
                            },
                        }}
                        titleKey="topics.nameAndDescription"
                        onSave={onSave}
                        editMode={!isEditing}
                        hideCancelButton={!isEditing}
                        hideSaveButton={!isEditing}
                        formProp={form}
                    >
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
                </Col>

                <Col span={12}>
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
                        editMode={!isEditing}
                        hideCancelButton={!isEditing}
                        hideSaveButton={!isEditing}
                        formProp={formSettings}
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
                    </CardEditable>
                </Col>
            </Row>
            {!isEditing && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 16 }}>
                    <Button onClick={onCancel}>{t('agency.add.general.cancel')}</Button>
                    <Button type="primary" onClick={() => form.submit()}>
                        {t('agency.add.general.save')}
                    </Button>
                </div>
            )}
        </Page>
    );
};
