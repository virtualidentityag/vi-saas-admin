import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import PublicPageLayoutWrapper from '../../components/Layout/PublicPageLayoutWrapper';
import { ReactComponent as UnauthorizedIcon } from '../../resources/img/illustrations/unauthorized.svg';
import styles from './styles.module.scss';

export const AccessDenied = () => {
    const { t } = useTranslation();

    return (
        <PublicPageLayoutWrapper hideFooter>
            <div className={styles.wrapper}>
                <div className={styles.illustrationContainer}>
                    <UnauthorizedIcon className={styles.illustration} />
                </div>
                <div className={styles.infoContainer}>
                    <h1 className={styles.title}>{t('errorPages.accessDenied.title')}</h1>
                    <div className={styles.description}>{t('errorPages.accessDenied.description')}</div>

                    <Button href="/admin" type="primary">
                        {t('toHomePage')}
                    </Button>
                </div>
            </div>
        </PublicPageLayoutWrapper>
    );
};
