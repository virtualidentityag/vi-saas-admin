export type TextTypeOptions =
  | "standard"
  | "infoLargeStandard"
  | "infoLargeAlternative"
  | "infoSmall"
  | "divider";

export interface TextProps {
  text: string;
  labelType?: LabelTypes;
  className?: string;
  type: TextTypeOptions;
}

export enum LabelTypes {
  NOTICE = "NOTICE",
}

const getLabelContent = (type: string) => {
  const labelContent = {
    className: "",
    text: "",
  };

  if (type === LabelTypes.NOTICE) {
    labelContent.className = "text__label--notice";
    labelContent.text = "Hinweis";
  }

  return labelContent;
};

export function Text(props: TextProps) {
  return (
    <p
      className={`text text__${props.type} ${
        props.className ? props.className : ""
      }`}
    >
      {props.labelType && (
        <span
          className={`text__label ${
            getLabelContent(props.labelType).className
          }`}
        >
          {getLabelContent(props.labelType).text}
        </span>
      )}
      <span
        /* eslint-disable */
        dangerouslySetInnerHTML={{
          __html: props.text,
        }}
        /* eslint-enable */
      />
    </p>
  );
}
