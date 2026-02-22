import { Form, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useTranslation } from 'react-i18next';
import { UploadFileProps } from '../../types/uploadFiles';
import decodeHTML from '../../utils/decodeHTML';
import getBase64 from '../../utils/getBase64';
import { validateUploadFile } from '../../utils/validateUploadFile';
import styles from './styles.module.scss';

interface CropUploadFieldProps {
    name?: string | string[];
    labelKey?: string;
    tooltip?: string;
    allowIcon?: boolean;
    aspect?: number;
    cropWidth?: number;
    cropHeight?: number;
}

interface CropUploadLocalProps {
    onChange?: (value: string) => void;
    value?: string;
    allowIcon: boolean;
    aspect: number;
}

const CropUploadLocal = ({ onChange, value, allowIcon, aspect }: CropUploadLocalProps) => {
    const { t } = useTranslation();

    const beforeUpload = (file: UploadFileProps) => {
        if (!validateUploadFile(file, t, allowIcon)) {
            return false;
        }
        getBase64(file as Blob, onChange);
        return false;
    };

    return (
        <ImgCrop
            aspect={aspect}
            modalTitle={t('btn.crop')}
            modalOk={t('btn.confirm')}
            modalCancel={t('btn.cancel')}
            quality={0.9}
            showReset
        >
            <Upload
                name="upload"
                listType="picture-card"
                className={styles.upload}
                showUploadList={false}
                beforeUpload={beforeUpload}
            >
                {value ? (
                    <img src={decodeHTML(value)} className={styles.image} alt="" />
                ) : (
                    <div className={styles.uploadButton}>{t('btn.upload')}</div>
                )}
            </Upload>
        </ImgCrop>
    );
};

export const CropUploadField = ({
    name,
    labelKey,
    tooltip,
    allowIcon = false,
    aspect = 1,
}: CropUploadFieldProps) => {
    const { t } = useTranslation();
    return (
        <Form.Item name={name} label={labelKey ? t(labelKey) : undefined} tooltip={tooltip}>
            <CropUploadLocal allowIcon={allowIcon} aspect={aspect} />
        </Form.Item>
    );
};
