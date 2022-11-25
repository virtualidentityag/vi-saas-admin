import { message, Modal } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useTranslation } from 'react-i18next';
import { useDeleteConsultant } from '../../../../../hooks/useDeleteConsultant';

interface DeleteUserModalProps {
    deleteUserId: string;
    onClose: () => void;
}

export const DeleteUserModal = ({ deleteUserId, onClose }: DeleteUserModalProps) => {
    const { t } = useTranslation();
    const { mutate: deleteConsultant } = useDeleteConsultant({
        onSuccess: () => {
            message.success({
                content: t('message.counselor.delete'),
                duration: 3,
            });
            onClose();
        },
    });

    return (
        <Modal
            title={<Title level={2}>{t('counselor.modal.headline.delete')}</Title>}
            open
            onOk={() => deleteConsultant(deleteUserId)}
            onCancel={onClose}
            cancelText={t('btn.cancel.uppercase')}
            closable={false}
            centered
            okText={t('btn.ok.uppercase')}
        >
            <p>{t('counselor.modal.text.delete')}</p>
        </Modal>
    );
};
