import { CancelTokenSource } from "axios";
import { TenantData } from "../../types/tenant";

/**
 * retrieve all needed tenant data
 * @param tenantData
 * @param cancelTokenSource {CancelTokenSource}
 * @return data
 */
const editFAKETenantData = (
  tenantData: TenantData,
  cancelTokenSource: CancelTokenSource
) => {
  const tenantResponse = tenantData;

  // eslint-disable-next-line no-console
  console.log("FAKE edit TenantData", tenantResponse, cancelTokenSource);

  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(tenantResponse);
    }, 1000);
  });
};

export default editFAKETenantData;
