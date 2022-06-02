import { useContext, useState, useMemo, useCallback, useEffect } from "react";

import Title from "antd/es/typography/Title";
import { Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";
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
import { store } from "../../store/store";

const { Paragraph } = Typography;

const OTP_LENGTH = 6;

const TWO_FACTOR_TYPES = {
  EMAIL: "EMAIL",
  APP: "APP",
  NONE: "",
};

const isStringValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

const userDataMock = {
  email: "test@test.com",
  twoFactorAuth: {
    isActive: false,
    qrCode:
      "iVBORw0KGgoAAAANSUhEUgAAAPYAAAD2AQAAAADNaUdlAAACw0lEQVR4Xu2WsY7cMAxE2fGX1YmdfllFAGUeFXtjF1dFBAKssNhb8/GAAcmhbOvH88vekef58nfkeb78HXme/4KHma81++yLj8/ma+xgCR/6hAuNaR6dL3OCVTx8TD6zj+hKsq7HIKWM7zjClsozyCzlayYxs8bfvoNFnJRmPVofS41qJvR3fw5zRnG8z2t+3/hfcg4lCZO+rEv4n3AJ11AEI6EBoT+t5VfTf9TwNQbrQYmN4ZA7Grntrs9pPnsQ125gTLShorEnqrhmoUfWRbq6nKpuNaajiE+mU76wvZRoFPqoWgmnO5REbRmYE2Ez7VHDecqgfCGh1Mn4eBFnGRHV88QWeh6yy72fznNWlAg2zRRVK/Nq+OJmzCytBG6nHBG/9R3nWlAK7+4g1POm+Pj3NEcYCQiLLJKKRodquIQEq8HQ13Na4+nfszxlGTXqeUt0KqPXlUvfaR7pxclrmbGk8xuNVdxxJHqoVB96njTrqs9pzjpgL6lITlOQqlXdLn3HOWoUpz/7/WTy4zO/h3n2R0/MJU1q2Sjrd/1Oc0aT1eR7TnGrfn70HeYC6FKepU21I1jStz+Oc2VIEX8abwlSKbEoruFs5WZpksAgQYlwaBFPeZYjQvAy6ac/h/lIh1KiyClRltpTyCfbsV9GwSGNW/Lyx3E+WJHBcEqlkpwe6R21igfaLlcYGMeUccZhYU5jJCmOczfd99Nprh+5msUyScOa/VlFnMnM9iTBILqcdkINZyJ1J4vLn5ESQ/M6inhwPapCW6UKtcskr9ZwDrdyzoneU2iX70gJlyh+I0vvJyMNMyT16s9pTmRfyDN3o1oloZi2iKsUWZoUhTmYj9RcxpkPVUitIa4dwaos5FqJTKRkySy+L8dVxUmRIvlUMl2t4rcTL+H0ItBFczQhuStzU9XwH86XvyPP8+XvyPP89/w3F0UfYRinml8AAAAASUVORK5CYII=",
    secret: "KvFS40q19KftGl9PnB6VSUBDafdKORhD",
  },
};

function TwoFactorAuth() {
  const { t } = useTranslation();
  let { userData } = store.getState();

  // DEMO MOCK
  userData = userDataMock;

  const [isSwitchChecked, setIsSwitchChecked] = useState<boolean>(
    userData.twoFactorAuth.isActive
  );
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
  const [email, setEmail] = useState<string>(userData.email);
  const [isRequestInProgress, setIsRequestInProgress] =
    useState<boolean>(false);

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

  const [twoFactorType, setTwoFactorType] = useState<string>(
    TWO_FACTOR_TYPES.APP
  );

  const selectTwoFactorTypeButtons = useCallback((): JSX.Element => {
    return (
      <div className="twoFactorAuth__selectType">
        <div className="twoFactorAuth__radioWrapper">
          <RadioButton
            checked={twoFactorType === TWO_FACTOR_TYPES.APP}
            handleRadioButton={() => {
              setTwoFactorType(TWO_FACTOR_TYPES.APP);
            }}
            label={t("twoFactorAuth.activate.radio.label.app")}
            inputId="radio_2fa_app"
            name="radio_2fa"
            type="default"
            value={TWO_FACTOR_TYPES.APP}
          />
          <Tooltip trigger={<InfoIcon />}>
            {t("twoFactorAuth.activate.radio.tooltip.app")}
          </Tooltip>
        </div>
        <div className="twoFactorAuth__radioWrapper">
          <RadioButton
            checked={twoFactorType === TWO_FACTOR_TYPES.EMAIL}
            handleRadioButton={() => {
              setTwoFactorType(TWO_FACTOR_TYPES.EMAIL);
            }}
            label={t("twoFactorAuth.activate.radio.label.email")}
            inputId="radio_2fa_email"
            name="radio_2fa"
            type="default"
            value={TWO_FACTOR_TYPES.EMAIL}
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
            disabled: twoFactorType === TWO_FACTOR_TYPES.NONE,
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
            src={`data:image/png;base64,${userData.twoFactorAuth.qrCode}`}
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
          <Text text={userData.twoFactorAuth.secret} type="standard" />
        </div>
      </div>
    );
  }, [userData.twoFactorAuth.secret, userData.twoFactorAuth.qrCode]);

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
      console.log("sendEmailActivationCode");
      // apiPutTwoFactorAuthEmail(email)
      // 	.then(() => {
      // 		if (triggerNextStep) triggerNextStep();
      // 		setHasDuplicateError(false);
      // 	})
      // 	.catch((error) => {
      // 		if (error.message === FETCH_ERRORS.PRECONDITION_FAILED) {
      // 			setEmailLabelState('invalid');
      // 			setEmailLabel(
      // 				translate(
      // 					'twoFactorAuth.activate.email.input.duplicate'
      // 				)
      // 			);
      // 			setHasDuplicateError(true);
      // 		}
      // 	});
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
        {userData.email && (
          <Text
            type="infoLargeAlternative"
            text={t("twoFactorAuth.activate.email.input.info")}
          />
        )}
      </div>
    );
  }, [emailInputItem, handleEmailChange, userData.email]);

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

  const activateTwoFactorAuthByType = useCallback(
    (triggerNextStep) => {
      let apiCall;
      let apiData;
      console.log("submit 2FA");
      // if (twoFactorType === TWO_FACTOR_TYPES.APP) {
      // 	apiCall = apiPutTwoFactorAuthApp;
      // 	apiData = {
      // 		secret: userData.twoFactorAuth.secret,
      // 		otp
      // 	};
      // }
      // if (twoFactorType === TWO_FACTOR_TYPES.EMAIL) {
      // 	apiCall = apiPostTwoFactorAuthEmailWithCode;
      // 	apiData = otp;
      // }

      // if (twoFactorType === TWO_FACTOR_TYPES.NONE) return;

      // if (!isRequestInProgress) {
      // 	setIsRequestInProgress(true);
      // 	setOtpInputInfo('');
      // 	apiCall(apiData)
      // 		.then(() => {
      // 			if (twoFactorType === TWO_FACTOR_TYPES.APP) {
      // 				setOverlayActive(false);
      // 			}
      // 			if (twoFactorType === TWO_FACTOR_TYPES.EMAIL) {
      // 				apiPatchTwoFactorAuthEncourage(false);
      // 				if (triggerNextStep) triggerNextStep();
      // 			}
      // 			setIsRequestInProgress(false);
      // 			updateUserData();
      // 		})
      // 		.catch((error) => {
      // 			if (error.message === FETCH_ERRORS.BAD_REQUEST) {
      // 				setOtpLabel(defaultOtpLabel);
      // 				setOtpInputInfo(
      // 					translate(
      // 						'twoFactorAuth.activate.otp.input.label.error'
      // 					)
      // 				);
      // 				setOtpLabelState('invalid');
      // 				setIsRequestInProgress(false);
      // 				setIsSwitchChecked(false);
      // 			}
      // 		});
      // }
    },
    [
      defaultOtpLabel,
      isRequestInProgress,
      otp,
      twoFactorType,
      // updateUserData,
      userData.twoFactorAuth.secret,
    ]
  );

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
            disabled: !userData.email && !(emailLabelState === "valid"),
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
        handleNextStep: activateTwoFactorAuthByType,
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
      activateTwoFactorAuthByType,
      email,
      emailCodeInput,
      emailLabelState,
      emailSelection,
      handleOverlayCloseSuccess,
      otpLabelState,
      sendEmailActivationCode,
      userData.email,
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
        handleOverlay: activateTwoFactorAuthByType,
        step: {
          icon: CheckIcon,
          label: t("twoFactorAuth.activate.app.step4.visualisation.label"),
        },
      },
    ],
    [
      activateTwoFactorAuthByType,
      connectAuthAccount,
      handleOtpChange,
      otpInputItem,
      otpLabelState,
    ]
  );

  const setOverlayByType = useCallback(() => {
    switch (twoFactorType) {
      case TWO_FACTOR_TYPES.EMAIL:
        setOverlayItems([
          ...twoFactorAuthStepsOverlayStart,
          ...twoFactorAuthStepsOverlayMail,
        ]);
        return;
      case TWO_FACTOR_TYPES.APP:
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
    setIsSwitchChecked(false);
    setOtp("");
    setEmail(userData.email || "");
    setEmailLabel(t("twoFactorAuth.activate.email.input.label"));
    setEmailLabelState("invalid");
    setHasDuplicateError(false);
    setOtpLabel(defaultOtpLabel);
    setOtpLabelState("invalid");
    setIsSwitchChecked(userData.twoFactorAuth.isActive);
    setTwoFactorType(userData.twoFactorAuth.type || TWO_FACTOR_TYPES.APP);
  }, [
    defaultOtpLabel,
    userData.email,
    userData.twoFactorAuth.isActive,
    userData.twoFactorAuth.type,
  ]);

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
