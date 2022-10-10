import { Col, message, Row } from "antd";
import { FormInstance, useWatch } from "antd/es/form/Form";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { PostCodeRange } from "../../../../../api/agency/getAgencyPostCodeRange";
import { useAgencyData } from "../../../../../hooks/useAgencyData";
import { useAgencyPostCodesData } from "../../../../../hooks/useAgencyPostCodesData";
import { useAgencyPostCodesUpdate } from "../../../../../hooks/useAgencyPostCodesUpdate";
import { useAgencyUpdate } from "../../../../../hooks/useAgencyUpdate";
import { AgencyData } from "../../../../../types/agency";
import { FormInputField } from "../../../../FormInputField";
import { FormSwitchField } from "../../../../FormSwitchField";
import PostCodeRanges from "../../../PostCodeRanges";
import { CardEditable } from "../CardEditable";

function hasOnlyDefaultRangeDefined(data: PostCodeRange[]) {
  return (
    data?.length === 1 && data[0].from === "00000" && data[0].until === "99999"
  );
}

interface AgencyAddressSettingsLocalProps {
  form: FormInstance;
  postCodes: PostCodeRange[];
}
function AgencyAddressSettingsLocal({
  form,
  postCodes,
}: AgencyAddressSettingsLocalProps) {
  const postCodeRangesActive = useWatch("postCodeRangesActive");

  return (
    <>
      <Row gutter={[20, 10]}>
        <Col xs={12} lg={6}>
          <FormInputField
            name="postcode"
            labelKey="agency.edit.general.address.postcode"
            placeholderKey="agency.edit.general.address.postcode"
            required
            maxLength={5}
          />
        </Col>
        <Col xs={12} lg={6}>
          <FormInputField
            name="city"
            labelKey="agency.edit.general.address.city"
            placeholderKey="agency.edit.general.address.city"
            required
          />
        </Col>
      </Row>

      <FormSwitchField
        labelKey="agency.edit.general.address.zip_code_scope"
        name="postCodeRangesActive"
        paragraphKey="agency.edit.general.address.zip_code_scope.information"
      />

      {postCodeRangesActive && (
        <PostCodeRanges agencyPostCodeRanges={postCodes} formInputData={form} />
      )}
    </>
  );
}

export function AgencyAddressSettings({ id }: { id: string }) {
  const [t] = useTranslation();
  const { data: agencyData, isLoading, refetch } = useAgencyData(id);
  const { mutate: updateAgency } = useAgencyUpdate(id);
  const { mutate } = useAgencyPostCodesUpdate(id);
  const { data: postCodes, isLoading: isLoadingPostCodes } =
    useAgencyPostCodesData(id);

  const saveInfo = useCallback(
    (formData) => {
      if (
        formData.city !== agencyData.city ||
        formData.postcode !== agencyData.postcode
      ) {
        updateAgency({
          city: formData.city,
          postcode: formData.postcode,
        } as Partial<AgencyData>);
      }

      mutate(formData, {
        onSuccess: () => {
          refetch();
          message.success({
            content: t("message.agency.update"),
            duration: 3,
          });
        },
      });
    },
    [agencyData]
  );

  return (
    <CardEditable
      isLoading={isLoading || isLoadingPostCodes}
      initialValues={{
        ...agencyData,
        postCodeRangesActive: !hasOnlyDefaultRangeDefined(postCodes),
      }}
      titleKey="agency.edit.general.address"
      onSave={saveInfo}
    >
      {(form) => (
        <AgencyAddressSettingsLocal postCodes={postCodes} form={form} />
      )}
    </CardEditable>
  );
}
