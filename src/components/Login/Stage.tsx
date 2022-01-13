import React from "react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import Spinner from "../Spinner/Spinner";

export interface StageProps {
  className?: string;
  hasAnimation?: boolean;
  isReady?: boolean;
}

/**
 * login component
 * checks if the users token is still valid
 * @constructor
 */
function Stage({ className, hasAnimation, isReady = true }: StageProps) {
  const { t } = useTranslation();
  return (
    <div
      id="loginLogoWrapper"
      className={clsx(className, "stage stage--animated", {
        "stage--ready": isReady,
      })}
    >
      <div className="stage__headline">
        <h1>{t("slogan")}</h1>
        <h4>{t("subSlogan")}</h4>
        <div className="logo" />
      </div>
      <Spinner className={clsx("stage__spinner", !hasAnimation && "hidden")} />
    </div>
  );
}

export default Stage;
