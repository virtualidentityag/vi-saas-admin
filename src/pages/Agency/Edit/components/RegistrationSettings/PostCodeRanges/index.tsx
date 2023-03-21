import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { FormInputField } from '../../../../../../components/FormInputField';
import styles from './styles.module.scss';

export const PostCodeRanges = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.postCodeRangesContainer}>
            <Form.List name="postCodes">
                {(fields, { add, remove }) => {
                    const elements = fields.map((field) => (
                        <div key={field.key}>
                            <Space size="small" align="center" className={styles.space}>
                                <FormInputField
                                    className={styles.input}
                                    name={[field.name, 'from']}
                                    placeholderKey="agency.form.registrationSettings.fromPostCode"
                                    required
                                    maxLength={5}
                                    rules={[{ min: 5, required: true, message: t('agency.postcode.minimum') }]}
                                />
                                <FormInputField
                                    className={styles.input}
                                    name={[field.name, 'until']}
                                    placeholderKey="agency.form.registrationSettings.toPostCode"
                                    required
                                    maxLength={5}
                                    rules={[{ min: 5, required: true, message: t('agency.postcode.minimum') }]}
                                />
                                <MinusOutlined className={styles.remove} onClick={() => remove(field.key)} />
                            </Space>
                        </div>
                    ));

                    return (
                        <>
                            <Typography.Paragraph>
                                {t('agency.form.registrationSettings.newPostCodeLabel')}
                            </Typography.Paragraph>
                            {elements}
                            <Button
                                size="small"
                                className="mb-m mr-sm"
                                type="default"
                                icon={<PlusOutlined />}
                                onClick={() => add({ from: '', until: '' })}
                            >
                                {t('agency.form.registrationSettings.addNewPostCode')}
                            </Button>
                        </>
                    );
                }}
            </Form.List>
        </div>
    );
};
