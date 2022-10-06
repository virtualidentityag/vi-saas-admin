import React from "react";
import { useTranslation } from "react-i18next";
import { Form, Slider } from "antd";
import "./slideformfield.styles.css";

export interface SliderFormFieldProps {
  label: string;
  name: string | string[];
  help?: string;
  min: number;
  max: number;
  disabled?: boolean;
}

export function SliderFormField({
  label,
  name,
  help,
  min,
  max,
  disabled,
}: SliderFormFieldProps) {
  const [t] = useTranslation();
  return (
    <Form.Item
      label={t(label)}
      help={help ? t(help) : undefined}
      name={name}
      className="sliderFormField"
    >
      <Slider
        disabled={disabled}
        range
        min={min}
        max={max}
        marks={{ [min]: min, [max]: max }}
        tooltipVisible
        getTooltipPopupContainer={(triggerNode) => triggerNode.parentElement}
      />
    </Form.Item>
  );
}
