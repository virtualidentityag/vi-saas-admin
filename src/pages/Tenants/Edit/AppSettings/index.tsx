import { Col, Row } from 'antd';
import { useParams } from 'react-router';
import { useAppConfigContext } from '../../../../context/useAppConfig';
import { UserRole } from '../../../../enums/UserRole';
import { useUserRoles } from '../../../../hooks/useUserRoles.hook';
import { CommunicationSettings } from './CommunicationSettings';
import { NotificationsSettings } from './NotificationsSettings';
import { OtherFunctionsSettings } from './OtherFunctionsSettings';

export const TenantAppSettings = () => {
    const { id } = useParams<{ id: string }>();
    const [, hasRole] = useUserRoles();
    const { settings } = useAppConfigContext();

    return (
        <Row gutter={[24, 24]}>
            <Col span={12} sm={6}>
                <NotificationsSettings tenantId={id} />
            </Col>

            {hasRole(UserRole.TenantAdmin) && (
                <Col span={12} sm={6}>
                    <CommunicationSettings tenantId={id} />
                    {!settings.multitenancyWithSingleDomainEnabled && <OtherFunctionsSettings tenantId={id} />}
                </Col>
            )}
        </Row>
    );
};