import { Col, Row } from 'antd';
import { useAppConfigContext } from '../../../../context/useAppConfig';
import { UserRole } from '../../../../enums/UserRole';
import { useUserRoles } from '../../../../hooks/useUserRoles.hook';
import { CommunicationSettings } from './CommunicationSettings';
import { NotificationsSettings } from './NotificationsSettings';
import { OtherFunctionsSettings } from './OtherFunctionsSettings';

export const TenantAppSettings = () => {
    const [, hasRole] = useUserRoles();
    const { settings } = useAppConfigContext();

    return (
        <Row gutter={[24, 24]}>
            <Col span={12} sm={6}>
                <NotificationsSettings />
            </Col>

            {hasRole(UserRole.TenantAdmin) && (
                <Col span={12} sm={6}>
                    <CommunicationSettings />
                    {!settings.multitenancyWithSingleDomainEnabled && <OtherFunctionsSettings />}
                </Col>
            )}
        </Row>
    );
};
