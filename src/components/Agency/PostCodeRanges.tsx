import { useTranslation } from "react-i18next";
import React, { useState } from "react";
import { Form, Input } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { PostCodeRange } from "../../api/agency/getAgencyPostCodeRange";

const { Item } = Form;

export default function PostCodeRanges(props: {
  defaultPostCodeRanges: PostCodeRange[];
  formData: any;
}) {
  const { t } = useTranslation();

  const [postcodeFromAdd] = useState("");

  const { defaultPostCodeRanges, formData } = props;
  const [postCodeRanges, setPostCodeRanges] = useState(defaultPostCodeRanges);

  const removeByIndex = (index: any) => {
    setPostCodeRanges(postCodeRanges.filter((el, idx) => idx !== index));
  };

  const postCodeRangeComponents = postCodeRanges.map((el, index) => {
    return (
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Item
          style={{ width: "40%" }}
          label={t("agency.postcode.from")}
          name={`postcodeFrom_${index}`}
          initialValue={el.from}
          rules={[{ required: true }]}
        >
          <Input />
        </Item>
        <Item
          style={{ width: "40%" }}
          label={t("agency.postcode.to")}
          name={`postcodeTo_${index}`}
          initialValue={el.until}
          rules={[{ required: true }]}
        >
          <Input />
        </Item>
        <div>
          <MinusOutlined onClick={() => removeByIndex(index)} />
        </div>
      </div>
    );
  });

  return (
    <>
      {postCodeRangeComponents}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Item
          style={{ width: "40%" }}
          label={t("agency.postcode.from")}
          name="postcodeFromAdd"
        >
          <Input value={postcodeFromAdd} />
        </Item>
        <Item
          style={{ width: "40%" }}
          label={t("agency.postcode.to")}
          name="postcodeUntilAdd"
        >
          <Input />
        </Item>
        <div>
          <PlusOutlined
            onClick={(idx) => {
              const postcodeFromAddValue = formData.getFieldsValue()
                .postcodeFromAdd as string;
              const postcodeUntilAdd = formData.getFieldsValue()
                .postcodeUntilAdd as string;
              postCodeRanges.push({
                from: postcodeFromAddValue,
                until: postcodeUntilAdd,
              });
              setPostCodeRanges([...postCodeRanges]);
              formData.setFieldsValue({ postcodeFromAdd: "" });
              formData.setFieldsValue({ postcodeUntilAdd: "" });
            }}
          />
        </div>
      </div>
    </>
  );
}
