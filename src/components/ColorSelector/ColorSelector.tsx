import { useEffect, useState } from 'react';
import { ColorPicker, Typography } from 'antd';

const { Title } = Typography;

interface ColorSelectorProps {
    isLoading: boolean;
    label: string;
    tenantColor: string;
    field: string;
    setColorValue: (field: string, color: string) => void;
}

const ColorSelector = ({ isLoading, label, tenantColor, setColorValue, field }: ColorSelectorProps) => {
    const [selectedColor, setSelectedColor] = useState(tenantColor);

    const handleOnChange = (color: string) => {
        setSelectedColor(color);
        setColorValue(field, color);
    };

    useEffect(() => {
        setSelectedColor(tenantColor);
    }, [tenantColor]);

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, background: '#fff', borderRadius: 8 }}>
            <ColorPicker
                value={selectedColor}
                onChange={(_, hex) => handleOnChange(hex)}
                disabledAlpha
                disabled={isLoading}
                size="large"
            />
            <div>
                <span>{label}</span>
                <Title level={4} style={{ marginBottom: 0 }}>HEX {selectedColor}</Title>
            </div>
        </div>
    );
};

export default ColorSelector;
