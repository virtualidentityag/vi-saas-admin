import { Spin } from 'antd';
import Title from 'antd/es/typography/Title';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import styles from './styles.module.scss';

interface PageProps {
    isLoading?: boolean;
    children?: React.ReactChild | React.ReactChild[];
}

interface PageTitleProps {
    titleKey: string;
    subTitleKey?: string;
    tabs?: Array<{ to: string; titleKey }>;
}

export const Page = ({ children, isLoading }: PageProps) => {
    return <div className={styles.page}>{isLoading ? <Spin /> : <div className={styles.content}>{children}</div>}</div>;
};

const PageTabs = ({ tabs }: { tabs: Array<{ to: string; titleKey }> }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.tabsContainer}>
            {tabs.map((tab) => (
                <NavLink className={styles.tab} to={tab.to} key={tab.titleKey}>
                    {t(tab.titleKey)}
                </NavLink>
            ))}
        </div>
    );
};

export const PageTitle = ({ titleKey, subTitleKey, tabs }: PageTitleProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.pageTitleContainer}>
            <div className={styles.titleContainer}>
                <Title level={3} className={styles.title}>
                    {t(titleKey)}
                </Title>
                {subTitleKey && <p>{t(subTitleKey)}</p>}
            </div>
            {tabs && <PageTabs tabs={tabs} />}
        </div>
    );
};

Page.Title = PageTitle;
