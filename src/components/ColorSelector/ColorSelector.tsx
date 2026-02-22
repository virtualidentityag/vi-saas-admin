import { useEffect, useState } from 'react';
import { ColorPicker } from 'antd';

interface ColorSelectorProps {
    isLoading: boolean;
    tenantColor: string;
    field: string;
    setColorValue: (field: string, color: string) => void;
}

const ColorSelector = ({ isLoading, tenantColor, setColorValue, field }: ColorSelectorProps) => {
    const [selectedColor, setSelectedColor] = useState(tenantColor);

    const handleOnChange = (color: string) => {
        setSelectedColor(color);
        setColorValue(field, color);
    };

    useEffect(() => {
        setSelectedColor(tenantColor);
    }, [tenantColor]);

    return (
        <ColorPicker
            value={selectedColor}
            onChange={(_, hex) => handleOnChange(hex)}
            disabledAlpha
            disabled={isLoading}
            size="large"
            showText
        />
    );
};

export default ColorSelector;
