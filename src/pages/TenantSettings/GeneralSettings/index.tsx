import { Col, Row } from 'antd';
import { Languages } from './components/Languages';
import { LogoAndFavicon } from './components/LogoAndFavicon';
import { NameAndSlogan } from './components/NameAndSlogan';
import { TenantColor } from './components/TenantColor';

export const GeneralSettings = () => {
    return (
        <Row gutter={[24, 24]}>
            <Col span={12} sm={6}>
                <NameAndSlogan />
                <Languages />
            </Col>
            <Col span={12} sm={6}>
                <LogoAndFavicon />
                <TenantColor />
            </Col>
        </Row>
    );
};
