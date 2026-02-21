import { FormInstance } from 'antd';
import { Dispatch, SetStateAction } from 'react';
import { EditableData } from './editabletable';

export interface RenderFormProps {
    form: FormInstance;
    setButtonDisabled: Dispatch<SetStateAction<boolean>>;
    isInAddMode: boolean;
    formData: EditableData;
}

interface ModalFormProps {
    isModalCreateVisible: boolean;
    handleOnAddElement: (arg0: EditableData) => void;
    handleCreateModalCancel: () => void;
    title: string;
    renderFormFields: (props: RenderFormProps) => React.ReactNode;
    isInAddMode: boolean;
    formData: EditableData;
}
