import { Spin } from 'antd';
import Title from 'antd/es/typography/Title';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface PageProps {
    isLoading?: boolean;
    children?: React.ReactChild | React.ReactChild[];
}

interface PageTitleProps {
    titleKey: string;
    subTitleKey?: string;
}

export const Page = ({ children, isLoading }: PageProps) => {
    return <div className={styles.page}>{isLoading ? <Spin /> : <div className={styles.content}>{children}</div>}</div>;
};

export const PageTitle = ({ titleKey, subTitleKey }: PageTitleProps) => {
    const { t } = useTranslation();

    return (
        <div className="pageTitle">
            <Title level={3}>{t(titleKey)}</Title>
            {subTitleKey && <p>{t(subTitleKey)}</p>}
        </div>
    );
};

Page.Title = PageTitle;
