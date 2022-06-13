import { useState, useMemo, useCallback, useEffect } from "react";
import Title from "antd/es/typography/Title";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";
import { FETCH_ERRORS } from "../../api/fetchData";
import {
  OVERLAY_FUNCTIONS,
  OverlayItem,
  OverlayWrapper,
  Overlay,
} from "../overlay/Overlay";
import { BUTTON_TYPES } from "../button/Button";
import { RadioButton } from "../radioButton/RadioButton";
import { Tooltip } from "../tooltip/Tooltip";
import { Text } from "../text/Text";
import {
  InputField,
  InputFieldItem,
  InputFieldLabelState,
} from "../inputField/InputField";
import { TwoFactorAuthResendMail } from "./TwoFactorAuthResendMail";
import { Headline } from "../headline/Headline";
import { ReactComponent as LockIcon } from "../../resources/img/svg/lock.svg";
import { ReactComponent as InfoIcon } from "../../resources/img/svg/i.svg";
import { ReactComponent as AddIcon } from "../../resources/img/svg/add.svg";
import { ReactComponent as UrlIcon } from "../../resources/img/svg/url.svg";
import { ReactComponent as CheckIcon } from "../../resources/img/svg/checkmark.svg";
import { ReactComponent as DownloadIcon } from "../../resources/img/svg/download.svg";
import { ReactComponent as PenIcon } from "../../resources/img/svg/pen.svg";
import { ReactComponent as IlluCheck } from "../../resources/img/illustrations/check.svg";
import { useUserData } from "../../hooks/useUserData.hook";
import { TwoFactorType } from "../../enums/TwoFactorType";
import {
  useUserTwoFactorAuth,
  useUserTwoFactorDelete,
  useUserTwoFactorSendEmailCode,
} from "../../hooks/useUserTwoFactorAuth.hook";

const { Paragraph } = Typography;

const OTP_LENGTH = 6;

const isStringValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

function TwoFactorAuth() {
  const { t } = useTranslation();
  const { data: userData } = useUserData();
  const { mutate: updateOrSetTwoFactorAuth } = useUserTwoFactorAuth();
  const { mutate: deleteTwoFactorAuth } = useUserTwoFactorDelete();
  const { mutate: setEmailForActivationCode } = useUserTwoFactorSendEmailCode();
  const [overlayActive, setOverlayActive] = useState<boolean>(false);
  const [otpLabelState, setOtpLabelState] = useState<InputFieldLabelState>();
  const [otp, setOtp] = useState<string>("");
  const [otpInputInfo, setOtpInputInfo] = useState<string>("");
  const defaultOtpLabel = t("twoFactorAuth.activate.otp.input.label");
  const [otpLabel, setOtpLabel] = useState<string>(defaultOtpLabel);
  const [hasDuplicateError, setHasDuplicateError] = useState(false);
  const [emailLabel, setEmailLabel] = useState<string>(
    t("twoFactorAuth.activate.email.input.label")
  );
  const [emailLabelState, setEmailLabelState] =
    useState<InputFieldLabelState>();
  const [email, setEmail] = useState<string>(userData?.email);
  const [twoFactorType, setTwoFactorType] = useState<TwoFactorType>(
    TwoFactorType.App
  );

  const handleSwitchChange = useCallback(() => {
    if (!userData.twoFactorAuth.isActive) {
      setOverlayActive(true);
    } else {
      deleteTwoFactorAuth(null);
    }
  }, [userData?.twoFactorAuth?.isActive, overlayActive]);

  const selectTwoFactorTypeButtons = useCallback((): JSX.Element => {
    return (
      <div className="twoFactorAuth__selectType">
        <div className="twoFactorAuth__radioWrapper">
          <RadioButton
            checked={twoFactorType === TwoFactorType.App}
            handleRadioButton={() => {
              setTwoFactorType(TwoFactorType.App);
            }}
            label={t("twoFactorAuth.activate.radio.label.app")}
            inputId="radio_2fa_app"
            name="radio_2fa"
            type="default"
            value={TwoFactorType.App}
          />
          <Tooltip trigger={<InfoIcon />}>
            {t("twoFactorAuth.activate.radio.tooltip.app")}
          </Tooltip>
        </div>
        <div className="twoFactorAuth__radioWrapper">
          <RadioButton
            checked={twoFactorType === TwoFactorType.Email}
            handleRadioButton={() => {
              setTwoFactorType(TwoFactorType.Email);
            }}
            label={t("twoFactorAuth.activate.radio.label.email")}
            inputId="radio_2fa_email"
            name="radio_2fa"
            type="default"
            value={TwoFactorType.Email}
          />
          <Tooltip trigger={<InfoIcon />}>
            {t("twoFactorAuth.activate.radio.tooltip.email")}
          </Tooltip>
        </div>
      </div>
    );
  }, [twoFactorType]);

  const twoFactorAuthStepsOverlayStart: OverlayItem[] = useMemo(
    () => [
      {
        headline: t("twoFactorAuth.activate.step1.title"),
        copy: t("twoFactorAuth.activate.step1.copy"),
        step: {
          icon: LockIcon,
          label: t("twoFactorAuth.activate.step1.visualisation.label"),
        },
        nestedComponent: selectTwoFactorTypeButtons(),
        buttonSet: [
          {
            disabled: twoFactorType === TwoFactorType.None,
            label: t("twoFactorAuth.overlayButton.next"),
            function: OVERLAY_FUNCTIONS.NEXT_STEP,
            type: BUTTON_TYPES.PRIMARY,
          },
        ],
      },
    ],
    [selectTwoFactorTypeButtons, twoFactorType]
  );

  const [overlayItems, setOverlayItems] = useState<OverlayItem[]>([
    ...twoFactorAuthStepsOverlayStart,
  ]);

  const getAuthenticatorTools = (): JSX.Element => {
    const tools = [
      {
        title: t("twoFactorAuth.activate.app.step2.tool1"),
        urlGoogle: t("twoFactorAuth.activate.app.step2.tool1.url.google"),
        urlApple: t("twoFactorAuth.activate.app.step2.tool1.url.apple"),
      },
      {
        title: t("twoFactorAuth.activate.app.step2.tool2"),
        urlGoogle: t("twoFactorAuth.activate.app.step2.tool2.url.google"),
        urlApple: t("twoFactorAuth.activate.app.step2.tool2.url.apple"),
      },
    ];
    return (
      <div className="twoFactorAuth__tools">
        {tools.map((tool, i) => {
          return (
            <div
              className="twoFactorAuth__tool"
              key={i} // eslint-disable-line react/no-array-index-key
            >
              <Text text={tool.title} type="standard" />
              <a target="_blank" rel="noreferrer" href={tool.urlGoogle}>
                <DownloadIcon />
                <Text
                  text={t("twoFactorAuth.activate.app.step2.download.google")}
                  type="standard"
                />
              </a>
              <a target="_blank" rel="noreferrer" href={tool.urlApple}>
                <DownloadIcon />
                <Text
                  text={t("twoFactorAuth.activate.app.step2.download.apple")}
                  type="standard"
                />
              </a>
            </div>
          );
        })}
      </div>
    );
  };

  const connectAuthAccount = useCallback((): JSX.Element => {
    return (
      <div className="twoFactorAuth__connect">
        <div className="twoFactorAuth__qrCode">
          <Text
            text={t("twoFactorAuth.activate.app.step3.connect.qrCode")}
            type="standard"
          />
          <img
            className="twoFactorAuth__qrCodeImage"
            alt="qr code"
            src={`data:image/png;base64,${userData?.twoFactorAuth.qrCode}`}
          />
        </div>
        <Text
          text={t("twoFactorAuth.activate.app.step3.connect.divider")}
          type="divider"
        />
        <div className="twoFactorAuth__key">
          <Text
            text={t("twoFactorAuth.activate.app.step3.connect.key")}
            type="standard"
          />
          <Text text={userData?.twoFactorAuth.secret} type="standard" />
        </div>
      </div>
    );
  }, [userData]);

  const validateOtp = (
    totp: any
  ): { validity: InputFieldLabelState; label: string } => {
    if (totp.length === OTP_LENGTH) {
      return {
        validity: "valid",
        label: t("twoFactorAuth.activate.otp.input.label"),
      };
    }
    if (totp.lenght === 0) {
      return {
        validity: "invalid",
        label: t("twoFactorAuth.activate.otp.input.label"),
      };
    }
    if (totp.length < OTP_LENGTH) {
      return {
        validity: "invalid",
        label: t("twoFactorAuth.activate.otp.input.label.short"),
      };
    }
    return {
      validity: "invalid",
      label: "",
    };
  };

  const handleOtpChange = useCallback((event) => {
    const validityData = validateOtp(event.target.value);
    setOtpLabelState(validityData.validity);
    setOtpLabel(validityData.label);
    setOtp(event.target.value);
  }, []);

  const handleAuthTokenUpdate = useCallback(
    (triggerNextStep) => {
      updateOrSetTwoFactorAuth(
        { twoFactorType, otp, secret: userData?.twoFactorAuth.secret },
        {
          onSuccess: () => {
            if (twoFactorType === TwoFactorType.App) {
              setOverlayActive(false);
            }
            if (twoFactorType === TwoFactorType.Email && triggerNextStep) {
              triggerNextStep();
            }
          },
          onError: ({ message }) => {
            if (message === FETCH_ERRORS.BAD_REQUEST) {
              setOtpLabel(defaultOtpLabel);
              setOtpInputInfo(
                t("twoFactorAuth.activate.otp.input.label.error")
              );
              setOtpLabelState("invalid");
            }
          },
        }
      );
    },
    [overlayActive, otp]
  );

  const otpInputItem: InputFieldItem = useMemo(
    () => ({
      content: otp,
      id: "otp",
      infoText: otpInputInfo,
      label: otpLabel,
      name: "otp",
      type: "text",
      labelState: otpLabelState,
      maxLength: OTP_LENGTH,
    }),
    [otp, otpInputInfo, otpLabel, otpLabelState]
  );

  const emailInputItem: InputFieldItem = useMemo(
    () => ({
      id: "email2FA",
      infoText: hasDuplicateError
        ? t("twoFactorAuth.activate.email.input.duplicate.info")
        : "",
      label: emailLabel,
      name: "email2FA",
      type: "text",
      labelState: emailLabelState,
      content: email,
    }),
    [email, emailLabel, emailLabelState, hasDuplicateError]
  );

  const validateEmail = (
    emailToValidate: string
  ): { validity: InputFieldLabelState; label: string } => {
    if (emailToValidate.length > 0 && isStringValidEmail(emailToValidate)) {
      return {
        validity: "valid",
        label: t("twoFactorAuth.activate.email.input.valid"),
      };
    }
    if (emailToValidate.length > 0) {
      return {
        validity: "invalid",
        label: t("twoFactorAuth.activate.email.input.invalid"),
      };
    }
    return {
      validity: "invalid",
      label: t("twoFactorAuth.activate.email.input.label"),
    };
  };

  const handleEmailChange = useCallback((event) => {
    const validityData = validateEmail(event.target.value);
    setEmailLabelState(validityData.validity);
    setEmailLabel(validityData.label);
    setEmail(event.target.value);
  }, []);

  const sendEmailActivationCode = useCallback(
    (triggerNextStep) => {
      setEmailForActivationCode(email, {
        onSuccess: () => {
          if (triggerNextStep) triggerNextStep();
          setHasDuplicateError(false);
        },
        onError: ({ message }) => {
          if (message === FETCH_ERRORS.PRECONDITION_FAILED) {
            setEmailLabelState("invalid");
            setEmailLabel(t("twoFactorAuth.activate.email.input.duplicate"));
            setHasDuplicateError(true);
          }
        },
      });
    },
    [email]
  );

  const emailSelection = useCallback((): JSX.Element => {
    return (
      <div className="twoFactorAuth__emailSelection">
        <InputField
          item={emailInputItem}
          inputHandle={(e: any) => handleEmailChange(e)}
        />
        {userData?.email && (
          <Text
            type="infoLargeAlternative"
            text={t("twoFactorAuth.activate.email.input.info")}
          />
        )}
      </div>
    );
  }, [emailInputItem, handleEmailChange, userData?.email]);

  const emailCodeInput = useCallback((): JSX.Element => {
    return (
      <div className="twoFactorAuth__emailCode">
        <InputField item={otpInputItem} inputHandle={handleOtpChange} />
        <TwoFactorAuthResendMail resendHandler={sendEmailActivationCode} />
      </div>
    );
  }, [handleOtpChange, otpInputItem, sendEmailActivationCode]);

  const emailConfirmation = (): JSX.Element => {
    return (
      <div className="twoFactorAuth__emailConfirmation">
        <IlluCheck />
        <Headline
          text={t("twoFactorAuth.activate.email.step4.title")}
          semanticLevel="3"
        />
      </div>
    );
  };

  const handleOverlayCloseSuccess = useCallback(() => {
    setOverlayActive(false);
    setOtp("");
    setHasDuplicateError(false);
    setOtpLabel(defaultOtpLabel);
    setOtpLabelState("invalid");
  }, [defaultOtpLabel]);

  const twoFactorAuthStepsOverlayMail: OverlayItem[] = useMemo(
    () => [
      {
        headline: t("twoFactorAuth.activate.email.step2.title"),
        copy: t("twoFactorAuth.activate.email.step2.copy"),
        step: {
          icon: PenIcon,
          label: t("twoFactorAuth.activate.email.step2.visualisation.label"),
        },
        nestedComponent: emailSelection(),
        handleNextStep: sendEmailActivationCode,
        buttonSet: [
          {
            label: t("twoFactorAuth.overlayButton.back"),
            function: OVERLAY_FUNCTIONS.PREV_STEP,
            type: BUTTON_TYPES.SECONDARY,
          },
          {
            disabled: !userData?.email && !(emailLabelState === "valid"),
            label: t("twoFactorAuth.overlayButton.next"),
            function: OVERLAY_FUNCTIONS.NEXT_STEP,
            type: BUTTON_TYPES.PRIMARY,
          },
        ],
      },
      {
        headline: t("twoFactorAuth.activate.email.step3.title"),
        copy: `${t(
          "twoFactorAuth.activate.email.step3.copy.1"
        )} <strong>${email}</strong> ${t(
          "twoFactorAuth.activate.email.step3.copy.2"
        )}`,
        nestedComponent: emailCodeInput(),
        buttonSet: [
          {
            label: t("twoFactorAuth.overlayButton.back"),
            function: OVERLAY_FUNCTIONS.PREV_STEP,
            type: BUTTON_TYPES.SECONDARY,
          },
          {
            disabled: otpLabelState !== "valid",
            label: t("twoFactorAuth.overlayButton.confirm"),
            function: OVERLAY_FUNCTIONS.NEXT_STEP,
            type: BUTTON_TYPES.PRIMARY,
          },
        ],
        handleNextStep: handleAuthTokenUpdate,
        step: {
          icon: UrlIcon,
          label: t("twoFactorAuth.activate.email.step3.visualisation.label"),
        },
      },
      {
        nestedComponent: emailConfirmation(),
        buttonSet: [
          {
            label: t("twoFactorAuth.overlayButton.close"),
            function: OVERLAY_FUNCTIONS.CLOSE_SUCCESS,
            type: BUTTON_TYPES.AUTO_CLOSE,
          },
        ],
        handleOverlay: handleOverlayCloseSuccess,
        step: {
          icon: CheckIcon,
          label: t("twoFactorAuth.activate.email.step4.visualisation.label"),
        },
      },
    ],
    [
      email,
      emailCodeInput,
      emailLabelState,
      emailSelection,
      handleOverlayCloseSuccess,
      otpLabelState,
      sendEmailActivationCode,
      userData?.email,
    ]
  );

  const twoFactorAuthStepsOverlayApp: OverlayItem[] = useMemo(
    () => [
      {
        headline: t("twoFactorAuth.activate.app.step2.title"),
        copy: t("twoFactorAuth.activate.app.step2.copy"),
        nestedComponent: getAuthenticatorTools(),
        buttonSet: [
          {
            label: t("twoFactorAuth.overlayButton.back"),
            function: OVERLAY_FUNCTIONS.PREV_STEP,
            type: BUTTON_TYPES.SECONDARY,
          },
          {
            label: t("twoFactorAuth.overlayButton.next"),
            function: OVERLAY_FUNCTIONS.NEXT_STEP,
            type: BUTTON_TYPES.PRIMARY,
          },
        ],
        step: {
          icon: AddIcon,
          label: t("twoFactorAuth.activate.app.step2.visualisation.label"),
        },
      },
      {
        headline: t("twoFactorAuth.activate.app.step3.title"),
        copy: t("twoFactorAuth.activate.app.step3.copy"),
        nestedComponent: connectAuthAccount(),
        buttonSet: [
          {
            label: t("twoFactorAuth.overlayButton.back"),
            function: OVERLAY_FUNCTIONS.PREV_STEP,
            type: BUTTON_TYPES.SECONDARY,
          },
          {
            label: t("twoFactorAuth.overlayButton.next"),
            function: OVERLAY_FUNCTIONS.NEXT_STEP,
            type: BUTTON_TYPES.PRIMARY,
          },
        ],
        step: {
          icon: UrlIcon,
          label: t("twoFactorAuth.activate.app.step3.visualisation.label"),
        },
      },
      {
        headline: t("twoFactorAuth.activate.app.step4.title"),
        copy: t("twoFactorAuth.activate.app.step4.copy"),
        nestedComponent: (
          <InputField item={otpInputItem} inputHandle={handleOtpChange} />
        ),
        buttonSet: [
          {
            label: t("twoFactorAuth.overlayButton.back"),
            function: OVERLAY_FUNCTIONS.PREV_STEP,
            type: BUTTON_TYPES.SECONDARY,
          },
          {
            disabled: otpLabelState !== "valid",
            label: t("twoFactorAuth.overlayButton.save"),
            type: BUTTON_TYPES.PRIMARY,
          },
        ],
        handleOverlay: handleAuthTokenUpdate,
        step: {
          icon: CheckIcon,
          label: t("twoFactorAuth.activate.app.step4.visualisation.label"),
        },
      },
    ],
    [connectAuthAccount, handleOtpChange, otpInputItem, otpLabelState]
  );

  const setOverlayByType = useCallback(() => {
    switch (twoFactorType) {
      case TwoFactorType.Email:
        setOverlayItems([
          ...twoFactorAuthStepsOverlayStart,
          ...twoFactorAuthStepsOverlayMail,
        ]);
        return;
      case TwoFactorType.App:
        setOverlayItems([
          ...twoFactorAuthStepsOverlayStart,
          ...twoFactorAuthStepsOverlayApp,
        ]);
        return;
      default:
        setOverlayItems([...twoFactorAuthStepsOverlayStart]);
    }
  }, [
    twoFactorType,
    twoFactorAuthStepsOverlayStart,
    twoFactorAuthStepsOverlayApp,
    twoFactorAuthStepsOverlayMail,
  ]);

  useEffect(() => {
    setOverlayByType();
  }, [setOverlayByType]);

  const handleOverlayClose = useCallback(() => {
    setOverlayActive(false);
    setOtp("");
    setEmail(userData.email || "");
    setEmailLabel(t("twoFactorAuth.activate.email.input.label"));
    setEmailLabelState("invalid");
    setHasDuplicateError(false);
    setOtpLabel(defaultOtpLabel);
    setOtpLabelState("invalid");
    setTwoFactorType(userData.twoFactorAuth.type || TwoFactorType.App);
  }, [defaultOtpLabel, userData]);

  return (
    <div className="twoFactorAuth">
      <Row gutter={40}>
        <Col xs={12} lg={6}>
          <Title className="formHeadline mb-m" level={4}>
            {t("twoFactorAuth.title")}
          </Title>
          <Paragraph className="mb-l desc">
            {t("twoFactorAuth.subtitle")}
          </Paragraph>
          <div className="twoFactorAuth__switch mb-m">
            <Switch
              onChange={handleSwitchChange}
              checked={userData?.twoFactorAuth.isActive || false}
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
            <Paragraph className="text desc">
              {userData?.twoFactorAuth.isActive
                ? t("twoFactorAuth.switch.active.label")
                : t("twoFactorAuth.switch.deactive.label")}
            </Paragraph>
          </div>
          {userData?.twoFactorAuth.isActive && userData.twoFactorAuth.type && (
            <p className="desc">
              <strong>{t("twoFactorAuth.switch.type.label")}</strong>{" "}
              {t(`twoFactorAuth.switch.type.${userData.twoFactorAuth.type}`)}{" "}
              {userData.twoFactorAuth.type === TwoFactorType.Email
                ? `(${userData.email})`
                : ""}
            </p>
          )}
          {overlayActive ? (
            <OverlayWrapper>
              <Overlay
                className="twoFactorAuth__overlay"
                items={overlayItems}
                handleOverlayClose={handleOverlayClose}
              />
            </OverlayWrapper>
          ) : null}
        </Col>
      </Row>
    </div>
  );
}

export default TwoFactorAuth;
