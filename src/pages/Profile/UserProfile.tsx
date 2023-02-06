import { Col, Row } from 'antd';
import { Card } from '../../components/Card';
import { Page } from '../../components/Page';
import { UserRole } from '../../enums/UserRole';
import { useUserRoles } from '../../hooks/useUserRoles.hook';
import { PasswordChange } from './PassswordChange';
import { PrivateData } from './PrivateData';
import TwoFactorAuth from './TwoFactorAuth/TwoFactorAuth';

export const UserProfile = () => {
    const [, hasRole] = useUserRoles();

    return (
        <Page>
            <Page.Title titleKey="profile.title" subTitleKey="profile.title.text" />

            <Row gutter={[24, 24]}>
                <Col span={12} md={6}>
                    {!hasRole(UserRole.TenantAdmin) && <PrivateData />}

                    <Card titleKey="twoFactorAuth.title" subTitleKey="twoFactorAuth.subtitle">
                        <TwoFactorAuth />
                    </Card>
                </Col>

                <Col span={12} md={6}>
                    <PasswordChange />
                </Col>
            </Row>
        </Page>
    );
};
