import { ChevronLeft } from '@mui/icons-material';
import { Spin } from 'antd';
import Title from 'antd/es/typography/Title';
import { useMemo } from 'react';
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

interface PageBackProps {
    titleKey: string;
    path: string;
}

export const Page = ({ children, isLoading }: PageProps) => {
    return <div className={styles.page}>{isLoading ? <Spin /> : <div className={styles.content}>{children}</div>}</div>;
};

const PageTabs = ({ tabs }: { tabs: Array<{ to: string; titleKey }> }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.tabsContainer}>
            {tabs
                ?.filter((tab) => tab.to)
                .map((tab) => (
                    <NavLink className={styles.tab} to={tab.to} key={tab.titleKey}>
                        {t(tab.titleKey)}
                    </NavLink>
                ))}
        </div>
    );
};

export const PageTitle = ({ titleKey, subTitleKey, tabs }: PageTitleProps) => {
    const { t } = useTranslation();
    const finalTabs = useMemo(() => tabs?.filter(Boolean) || [], [tabs]);

    return (
        <div className={styles.pageTitleContainer}>
            <div className={styles.titleContainer}>
                <Title level={3} className={styles.title}>
                    {t(titleKey)}
                </Title>
                {subTitleKey && <p>{t(subTitleKey)}</p>}
            </div>
            {finalTabs?.length && <PageTabs tabs={finalTabs} />}
        </div>
    );
};

export const PageBack = ({ path, titleKey }: PageBackProps) => {
    const { t } = useTranslation();

    return (
        <div className={styles.back}>
            <NavLink to={path} className={styles.backLink}>
                <ChevronLeft />
                <h3 className={styles.backHeadline}>{t(titleKey)}</h3>
            </NavLink>
        </div>
    );
};

Page.Title = PageTitle;
Page.Back = PageBack;
