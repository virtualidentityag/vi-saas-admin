import { message, Modal, notification, Checkbox } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useTranslation } from 'react-i18next';
import { useCallback, useState } from 'react';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import i18next from 'i18next';
import { useDeleteConsultantOrAgencyAdmin } from '../../../../../hooks/useDeleteConsultantOrAdmin';
import { Text } from '../../../../../components/text/Text';
import { FETCH_ERRORS, X_REASON } from '../../../../../api/fetchData';

interface DeleteUserModalProps {
    typeOfUser: 'consultants' | 'admins';
    deleteUserId: string;
    onClose: () => void;
}

export const DeleteUserModal = ({ typeOfUser, deleteUserId, onClose }: DeleteUserModalProps) => {
    const { t } = useTranslation();
    const [hasSessions, setHasSessions] = useState(false);
    const [force, setForce] = useState(false);
    const { mutate: deleteConsultant } = useDeleteConsultantOrAgencyAdmin({
        typeOfUser,
        onSuccess: () => {
            message.success({
                content: t('message.counselor.delete.success'),
                duration: 3,
            });
            onClose();
        },
        onError: (error: Error | Response) => {
            if (error instanceof Response) {
                if (error.headers.get(FETCH_ERRORS.X_REASON) === X_REASON.CONSULTANT_HAS_ACTIVE_OR_ARCHIVE_SESSIONS) {
                    notification.error({
                        message: t('message.counselor.delete.error.hasSessions'),
                    });
                    setHasSessions(true);
                } else {
                    message.error({
                        content: i18next.t([
                            `message.error.${error.headers.get(FETCH_ERRORS.X_REASON)}`,
                            'message.error.default',
                        ]),
                        duration: 3,
                    });
                }
            }
        },
    });

    const onChange = useCallback((e: CheckboxChangeEvent) => {
        setForce(e.target.checked);
    }, []);

    return (
        <Modal
            title={<Title level={2}>{t('counselor.modal.headline.delete')}</Title>}
            open
            onOk={() => deleteConsultant({ id: deleteUserId, forceDelete: hasSessions })}
            onCancel={onClose}
            cancelText={t('btn.cancel.uppercase')}
            closable={false}
            centered
            okText={t(hasSessions ? 'forceDelete' : 'delete')}
            okButtonProps={{ disabled: hasSessions && !force }}
        >
            <p>{t('counselor.modal.text.delete.text')}</p>

            {hasSessions && (
                <Checkbox onChange={onChange} checked={force}>
                    <Text text={t('counselor.modal.text.delete.error.hasSessions')} type="error" />
                </Checkbox>
            )}
        </Modal>
    );
};
