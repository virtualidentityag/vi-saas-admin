import { App, Button, Modal } from 'antd';
import Title from 'antd/es/typography/Title';
import { useTranslation } from 'react-i18next';
import { useDeleteTenantAdmin } from '../../../../../hooks/useDeleteTenantAdmin';
import { CounselorData } from '../../../../../types/counselor';

interface DeleteTenantAdminModalProps {
    user: CounselorData;
    onClose: () => void;
}

export const DeleteTenantAdminModal = ({ user, onClose }: DeleteTenantAdminModalProps) => {
    const { notification } = App.useApp();
    const { t } = useTranslation();
    const { mutate: deleteAdmin } = useDeleteTenantAdmin({
        onSuccess: () => {
            notification.success({
                title: t('tenantAdmins.delete.success'),
            });
            onClose();
        },
    });

    return (
        <Modal
            title={
                <Title level={2}>
                    {t('tenantAdmins.delete.description', { name: `${user.firstname} ${user.lastname}`.trim() })}
                </Title>
            }
            open
            onCancel={onClose}
            centered
            footer={
                <>
                    <Button type="default" onClick={() => deleteAdmin(user.id)}>
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
