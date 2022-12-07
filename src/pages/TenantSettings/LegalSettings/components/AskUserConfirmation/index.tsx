import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import Title from 'antd/lib/typography/Title';

export interface AskUserPermissionProps {
    titleKey: string;
    cancelLabelKey: string;
    okLabelKey: string;
    contentKey: string;
    onConfirm: () => void;
    onClose: () => void;
}

export const AskUserPermissionModal = ({
    titleKey,
    okLabelKey,
    cancelLabelKey,
    onConfirm,
    onClose,
    contentKey,
}: AskUserPermissionProps) => {
    const { t } = useTranslation();

    return (
        <Modal
            title={<Title level={2}>{t(titleKey)}</Title>}
            open
            onOk={onConfirm}
            onCancel={onClose}
            cancelText={t(cancelLabelKey)}
            centered
            okText={t(okLabelKey)}
        >
            {t(contentKey)}
        </Modal>
    );
};
