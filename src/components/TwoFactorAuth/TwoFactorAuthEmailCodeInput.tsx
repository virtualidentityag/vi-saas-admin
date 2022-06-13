import { InputField } from "../inputField/InputField";
import { TwoFactorAuthResendMail } from "./TwoFactorAuthResendMail";

export function TwoFactorAutoEmailCodeInput({
  otpInputItem,
  handleOtpChange,
  sendEmailActivationCode,
}) {
  return (
    <div className="twoFactorAuth__emailCode">
      <InputField item={otpInputItem} inputHandle={(e) => handleOtpChange(e)} />
      <TwoFactorAuthResendMail
        resendHandler={() => {
          sendEmailActivationCode();
        }}
      />
    </div>
  );
}
