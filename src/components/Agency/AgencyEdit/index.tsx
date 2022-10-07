import { Col, Row } from "antd";
import { useLocation } from "react-router";
import { AgencyAddressSettings } from "./components/AgencyAddressSettings";
import { ConsultingSettings } from "./components/CounsultingSettings";
import { AgencyGeneralInformation } from "./components/GeneralInformation";

export function AgencyEdit() {
  const currentPath = useLocation().pathname;
  const [, agencyID] = currentPath.match(/.*\/([^/]+)\/[^/]+/);

  return (
    <div className="editForm">
      <Row gutter={[20, 10]}>
        <Col xs={12} lg={6}>
          <AgencyGeneralInformation id={agencyID} />
          <AgencyAddressSettings id={agencyID} />
        </Col>
        <Col xs={12} lg={6}>
          <ConsultingSettings id={agencyID} />
        </Col>
      </Row>
    </div>
  );
}
