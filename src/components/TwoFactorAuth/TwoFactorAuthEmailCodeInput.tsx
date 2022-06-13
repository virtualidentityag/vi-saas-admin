import { InputField, InputFieldItem } from "../inputField/InputField";
import { TwoFactorAuthResendMail } from "./TwoFactorAuthResendMail";

interface TwoFactorAuthEmailCodeInputProps {
  otpInputItem: InputFieldItem;
  handleOtpChange: Function;
  sendEmailActivationCode: Function;
}

export function TwoFactorAuthEmailCodeInput({
  otpInputItem,
  handleOtpChange,
  sendEmailActivationCode,
}: TwoFactorAuthEmailCodeInputProps) {
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
