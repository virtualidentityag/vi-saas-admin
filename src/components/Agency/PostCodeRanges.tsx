import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";
import { PostCodeRange } from "../../api/agency/getAgencyPostCodeRange";

const { Item } = Form;

export default function PostCodeRanges(props: {
  agencyPostCodeRanges: PostCodeRange[];
  formInputData: Record<string, any>;
}) {
  const { t } = useTranslation();

  const { agencyPostCodeRanges, formInputData } = props;
  const [postCodeRanges, setPostCodeRanges] = useState(agencyPostCodeRanges);

  useEffect(() => {
    setPostCodeRanges(agencyPostCodeRanges);
  }, [agencyPostCodeRanges]);

  const removeAction = (index: number) => {
    setPostCodeRanges(postCodeRanges.filter((el, idx) => idx !== index));
  };

  const postCodeRangeComponents = postCodeRanges.map((el, index) => {
    return (
      <div
        key={index}
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <Item
          key="from"
          style={{ width: "40%" }}
          label={t("agency.postcode.from")}
          name={`postcodeFrom_${index}`}
          initialValue={el.from}
          rules={[{ required: true }]}
        >
          <Input key={`until_from_${index}`} />
        </Item>
        <Item
          key="until"
          style={{ width: "40%" }}
          label={t("agency.postcode.until")}
          name={`postcodeTo_${index}`}
          initialValue={el.until}
          rules={[{ required: true }]}
        >
          <Input key="input_until" />
        </Item>
        <div
          key="minus_container"
          style={{
            alignItems: "center",
            display: "flex",
            width: "14px",
          }}
        >
          {postCodeRanges.length - 1 === index && (
            <MinusOutlined key="minus" onClick={() => removeAction(index)} />
          )}
        </div>
      </div>
    );
  });

  const addAction = () => {
    const postcodeFromAddValue = formInputData.getFieldsValue()
      .postcodeFromAdd as string;
    const postcodeUntilAdd = formInputData.getFieldsValue()
      .postcodeUntilAdd as string;
    postCodeRanges.push({
      from: postcodeFromAddValue,
      until: postcodeUntilAdd,
    });
    setPostCodeRanges([...postCodeRanges]);
    formInputData.setFieldsValue({ postcodeFromAdd: "" });
    formInputData.setFieldsValue({ postcodeUntilAdd: "" });
  };

  return (
    <>
      {postCodeRangeComponents}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Item
          style={{ width: "40%" }}
          label={t("agency.postcode.from")}
          name="postcodeFromAdd"
        >
          <Input />
        </Item>
        <Item
          style={{ width: "40%" }}
          label={t("agency.postcode.until")}
          name="postcodeUntilAdd"
        >
          <Input />
        </Item>
        <div
          style={{
            alignItems: "center",
            display: "flex",
            width: "14px",
          }}
        >
          <PlusOutlined onClick={addAction} />
        </div>
      </div>
    </>
  );
}
