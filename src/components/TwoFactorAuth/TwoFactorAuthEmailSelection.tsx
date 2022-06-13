import { useTranslation } from "react-i18next";
import { Text } from "../text/Text";
import { InputField } from "../inputField/InputField";

export function TwoFactorAuthEmailSelection({
  userData,
  emailInputItem,
  handleEmailChange,
}) {
  const { t } = useTranslation();
  return (
    <div className="twoFactorAuth__emailSelection">
      <InputField
        item={emailInputItem}
        inputHandle={(e) => {
          handleEmailChange(e);
        }}
      />
      {userData?.email && (
        <Text
          type="infoLargeAlternative"
          text={t("twoFactorAuth.activate.email.input.info")}
        />
      )}
    </div>
  );
}
