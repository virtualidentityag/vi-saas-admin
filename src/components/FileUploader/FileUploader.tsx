import { Form, Upload } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import getBase64 from '../../utils/getBase64';
import { UploadFileProps } from '../../types/uploadFiles';
import { validateUploadFile } from '../../utils/validateUploadFile';

const { Item } = Form;

const FileUploader = ({
    name,
    label,
    getValueFromEvent,
    imageUrl,
    setImageUrl,
}: {
    name: string;
    label: string;
    getValueFromEvent: (e: React.ChangeEvent) => void;
    imageUrl: string;
    setImageUrl: (fileBase64: string) => void;
}) => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const beforeUpload = (file: UploadFileProps) => {
        if (!validateUploadFile(file, t, name === 'favicon')) {
            return false;
        }

        getBase64(file as Blob, (imgUrl1: string) => {
            setLoading(false);
            setImageUrl(imgUrl1);
        });
        // NOT really upload a file since we use the base64 as string :O)
        return false;
    };

    return (
        <Item label={label} getValueFromEvent={getValueFromEvent} className="block">
            <Upload
                name="upload"
                listType="picture-card"
                className="fileUploader"
                showUploadList={false}
                beforeUpload={beforeUpload}
            >
                {imageUrl ? (
                    <img src={imageUrl} alt={name} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                ) : (
                    <div>
                        {loading ? <LoadingOutlined /> : <PlusOutlined />}
                        <div style={{ marginTop: 8 }}>{t('btn.upload')}</div>
                    </div>
                )}
            </Upload>
        </Item>
    );
};

export default FileUploader;
