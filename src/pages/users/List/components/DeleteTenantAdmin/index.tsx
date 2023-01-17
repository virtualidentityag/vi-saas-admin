import { Button, Modal, notification } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useTranslation } from 'react-i18next';
import { useDeleteTenantAdmin } from '../../../../../hooks/useDeleteTenantAdmin';

interface DeleteTenantAdminModalProps {
    id: string;
    onClose: () => void;
}

export const DeleteTenantAdminModal = ({ id, onClose }: DeleteTenantAdminModalProps) => {
    const { t } = useTranslation();
    const { mutate: deleteAdmin } = useDeleteTenantAdmin({
        onSuccess: () => {
            notification.success({
                message: t('tenantAdmins.delete.success'),
            });
            onClose();
        },
    });

    return (
        <Modal
            title={<Title level={2}>{t('tenantAdmins.delete.description')}</Title>}
            open
            onCancel={onClose}
            centered
            footer={
                <>
                    <Button type="default" onClick={() => deleteAdmin(id)}>
                        {t('delete')}
                    </Button>
                    <Button type="primary" onClick={onClose}>
                        {t('btn.cancel.uppercase')}
                    </Button>
                </>
            }
        />
    );
};
