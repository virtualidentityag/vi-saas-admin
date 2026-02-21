import { Form } from 'antd';
import { FormItemProps } from 'antd/es/form/FormItem';
import TiptapEditor from './TiptapEditor';

type FormEditorProps = {
    name?: string | string[];
    placeholder: string;
    disabled?: boolean;
    className?: string;
    placeholders?: { [key: string]: string };
    itemProps: FormItemProps;
};

const FormPluginEditor = ({ placeholder, className, placeholders, itemProps, name }: FormEditorProps) => {
    return (
        <Form.Item {...itemProps} className={itemProps.className} name={name}>
            <TiptapEditor placeholder={placeholder} placeholders={placeholders} className={className} />
        </Form.Item>
    );
};

export default FormPluginEditor;
