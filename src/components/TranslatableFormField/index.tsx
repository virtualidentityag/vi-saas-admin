import { Form, Select } from 'antd';
import { FieldContext } from 'rc-field-form';
import classNames from 'classnames';
import { cloneElement, useContext } from 'react';
import { CheckCircleTwoTone, WarningTwoTone } from '@ant-design/icons';
import styles from './styles.module.scss';
import { SelectFormField } from '../SelectFormField';

const languages = [
    { label: 'German', value: 'de' },
    { label: 'English', value: 'en' },
];

export interface TranslatableFormFieldProps {
    name: string | string[];
    children: React.ReactElement;
}

export const TranslatableFormField = ({ name, children }: TranslatableFormFieldProps) => {
    const namePath = name instanceof Array ? name : [name];
    const formContext = useContext(FieldContext);
    const fieldData = Form.useWatch([...namePath]);

    const errors = formContext.getFieldsError(languages.map(({ value }) => [...namePath, value])).reduce((c, data) => {
        const lng = data.name[data.name.length - 1];
        return {
            ...c,
            [lng]: !fieldData?.[lng] || data.errors.length > 0,
        };
    }, {});

    return (
        <>
            <SelectFormField name={[...namePath, 'translate']}>
                {languages.map((language) => (
                    <Select.Option value={language.value} key={language.value}>
                        <div className={styles.containerLabel}>
                            {language.label}
                            {errors[language.value] ? (
                                <WarningTwoTone twoToneColor="#FF9F00" />
                            ) : (
                                <CheckCircleTwoTone twoToneColor="#4FCC5C" />
                            )}
                        </div>
                    </Select.Option>
                ))}
            </SelectFormField>

            {languages.map((language) =>
                cloneElement(children, {
                    name: [...namePath, language.value],
                    key: language.value,
                    className: classNames({
                        [styles.activeLanguage]: fieldData?.translate === language.value,
                        [styles.notActive]: fieldData?.translate !== language.value,
                    }),
                }),
            )}
        </>
    );
};
