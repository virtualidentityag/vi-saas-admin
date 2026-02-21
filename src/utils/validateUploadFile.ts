import { message } from 'antd';
import { UploadFileProps } from '../types/uploadFiles';

const MAX_FILE_SIZE_KB = 512;

export const validateUploadFile = (
    file: UploadFileProps,
    t: (key: string) => string,
    allowIcon: boolean,
): boolean => {
    const isJpgOrPng =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        (allowIcon && (file.type === 'image/x-icon' || file.type === 'image/vnd.microsoft.icon'));

    if (!isJpgOrPng) {
        message.error(t('message.error.upload.filetype'));
        return false;
    }

    if (file.size / 1024 > MAX_FILE_SIZE_KB) {
        message.error(t('message.error.upload.filesize'));
        return false;
    }

    return true;
};
