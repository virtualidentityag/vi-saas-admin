import { useCallback } from 'react';
import { App, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import Title from 'antd/es/typography/Title';
import { deleteTopicData } from '../../../api/topic/deleteTopicData';

export const TopicDeletionModal = ({ id, onClose }: { id: number; onClose: () => void }) => {
    const { notification } = App.useApp();
    const { t } = useTranslation();
    const handleOnDelete = useCallback(() => {
        deleteTopicData(id).then(() => {
            notification.success({
                message: t('message.topic.delete'),
                duration: 3,
            });
            onClose();
        });
    }, []);

    return (
        <Modal
            title={<Title level={2}>{t('topic.modal.headline.delete')}</Title>}
            open
            onOk={handleOnDelete}
            onCancel={onClose}
            cancelText={t('btn.cancel.uppercase')}
            centered
            okText={t('btn.ok.uppercase')}
        >
            <p>{t('topic.modal.text.delete')}</p>
        </Modal>
    );
};
