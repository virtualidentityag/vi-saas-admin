import { Col, Row } from 'antd';
import { Languages } from './components/Languages';
import { LogoAndFavicon } from './components/LogoAndFavicon';
import { NameAndSlogan } from './components/NameAndSlogan';
import { TenantColor } from './components/TenantColor';

export const GeneralSettings = () => {
    return (
        <Row gutter={[20, 10]}>
            <Col span={12} sm={6}>
                <NameAndSlogan />
            </Col>
            <Col span={12} sm={6}>
                <LogoAndFavicon />
            </Col>
            <Col span={12} sm={6}>
                <Languages />
            </Col>
            <Col span={12} sm={6}>
                <TenantColor />
            </Col>
        </Row>
    );
};
