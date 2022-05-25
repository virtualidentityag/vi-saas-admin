import * as React from "react";
import { useContext, useState } from "react";

import Title from "antd/es/typography/Title";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import Switch from "react-switch";

const { Paragraph } = Typography;

function TwoFactorAuth() {
  const { t } = useTranslation();
  // const { userData } = useContext(UserDataContext);
  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(true);
  // ( userData.twoFactorAuth.isActive );
  const [overlayActive, setOverlayActive] = useState<boolean>(false);

  const handleSwitchChange = () => {
    if (!isSwitchChecked) {
      setIsSwitchChecked(true);
      setOverlayActive(true);
    } else {
      setIsSwitchChecked(false);
      //   apiDeleteTwoFactorAuth()
      //     .then((response) => {
      //       updateUserData();
      //     })
      //     .catch((error) => {
      //       setIsSwitchChecked(true);
      //     });
    }
  };
  return (
    <div className="twoFactorAuth">
      <Row gutter={40}>
        <Col xs={12} lg={6}>
          <Title className="formHeadline mb-m" level={4}>
            {t("twoFactorAuth.title")}
          </Title>
          <Paragraph className="mb-l">{t("twoFactorAuth.subtitle")}</Paragraph>
          <Switch
            onChange={handleSwitchChange}
            checked={isSwitchChecked}
            uncheckedIcon={false}
            checkedIcon={false}
            width={48}
            height={26}
            onColor="#0dcd21"
            offColor="#8C878C"
            boxShadow="0px 1px 4px rgba(0, 0, 0, 0.6)"
            handleDiameter={27}
            activeBoxShadow="none"
          />
          <Paragraph className="mb-l">
            {isSwitchChecked
              ? t("twoFactorAuth.switch.active.label")
              : t("twoFactorAuth.switch.deactive.label")}
          </Paragraph>
        </Col>
      </Row>
    </div>
  );
}

export default TwoFactorAuth;
