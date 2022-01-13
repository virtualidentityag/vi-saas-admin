import React, { useState } from "react";
import { BgColorsOutlined } from "@ant-design/icons";
import { SketchPicker } from "react-color";

interface ColorSelectorProps {
  tenantColor: string;
  field: string;
  setColorValue: (field: string, color: string) => void;
}

function ColorSelector({
  tenantColor,
  setColorValue,
  field,
}: ColorSelectorProps) {
  const [selectedColor, setSelectedColor] = useState(tenantColor || "#CCCCCC");
  const [isOpen, setIsOpen] = useState(false);

  const handleOnChange = (color: string) => {
    setSelectedColor(color);
    setColorValue(field, color);
  };

  return (
    <>
      <BgColorsOutlined
        color={selectedColor}
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <div
          style={{
            position: "absolute",
            zIndex: "2",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "0px",
              right: "0px",
              bottom: "0px",
              left: "0px",
              transform: "translate(-77px,13px)",
            }}
          >
            <SketchPicker
              color={selectedColor}
              onChange={(color: any) => handleOnChange(color.hex)}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ColorSelector;
