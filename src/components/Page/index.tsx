import Title from 'antd/es/typography/Title';
import { useTranslation } from 'react-i18next';

interface PageProps {
    children?: React.ReactChild | React.ReactChild[];
}

interface PageTitleProps {
    titleKey: string;
    subTitleKey?: string;
}

export const Page = ({ children }: PageProps) => {
    return <div>{children}</div>;
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
