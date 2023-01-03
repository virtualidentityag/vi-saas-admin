import { Col, Row } from 'antd';
import { PermissionAction } from '../../../enums/PermissionAction';
import { Resource } from '../../../enums/Resource';
import { useUserPermissions } from '../../../hooks/useUserPermission';
import { Languages } from './components/Languages';
import { LogoAndFavicon } from './components/LogoAndFavicon';
import { NameAndSlogan } from './components/NameAndSlogan';
import { TenantColor } from './components/TenantColor';

export const GeneralSettings = () => {
    const { can } = useUserPermissions();

    return (
        <Row gutter={[24, 24]}>
            <Col span={12} sm={6}>
                <NameAndSlogan />
                {can(PermissionAction.Update, Resource.Language) && <Languages />}
            </Col>
            <Col span={12} sm={6}>
                <LogoAndFavicon />
                <TenantColor />
            </Col>
        </Row>
    );
};
