import { notification } from 'antd';
import classNames from 'classnames';
import { CopyToClipboard as LibCopyToClipboard } from 'react-copy-to-clipboard';
import { useTranslation } from 'react-i18next';
import { CopyOutlined } from '@ant-design/icons';
import styles from './styles.module.scss';

interface CopyToClipboardProps {
    className?: string;
    children: string;
    copiedKey?: string;
}

export const CopyToClipboard = ({ className, children, copiedKey }: CopyToClipboardProps) => {
    const { t } = useTranslation();

    return (
        <div className={classNames(className, styles.container)}>
            {children}
            <LibCopyToClipboard
                text={children}
                onCopy={() => notification.success({ title: t(copiedKey || 'notification.copy.success') })}
            >
                <CopyOutlined className={styles.icon} />
            </LibCopyToClipboard>
        </div>
    );
};
