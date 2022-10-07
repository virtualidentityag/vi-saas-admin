import React from "react";
import { useTranslation } from "react-i18next";
import { Form, Slider } from "antd";
import DisabledContext from "antd/es/config-provider/DisabledContext";

export interface SliderFormFieldProps {
  label: string;
  name: string | string[];
  help?: string;
  min: number;
  max: number;
}

export function SliderFormField({
  label,
  name,
  help,
  min,
  max,
}: SliderFormFieldProps) {
  const contextDisabled = React.useContext(DisabledContext);
  const [t] = useTranslation();

  return (
    <Form.Item
      label={t(label)}
      help={help ? t(help) : undefined}
      name={name}
      className="sliderFormField"
    >
      <Slider
        disabled={contextDisabled}
        range
        min={min}
        max={max}
        marks={{ [min]: min, [max]: max }}
        tooltip={{
          open: true,
          getPopupContainer: (triggerNode) => triggerNode.parentElement,
        }}
      />
    </Form.Item>
  );
}
