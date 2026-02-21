import { fetchData, FETCH_METHODS } from '../fetchData';
import { tenantEndpoint } from '../../appConfig';
import { TenantData } from '../../types/tenant';
import { getValueFromCookie } from '../auth/accessSessionCookie';
import parseJwt from '../../utils/parseJWT';

/**
 * retrieve all needed tenant data
 * @return data
 */
const getTenantData = (tenantData: TenantData, useMultiTenancyWithSingleDomain: boolean) => {
    const accessToken = getValueFromCookie('keycloak');
    let tenantId = tenantData.id;
    if (useMultiTenancyWithSingleDomain && accessToken) {
        const access = parseJwt(accessToken || '');
        tenantId = (access?.tenantId as number) || tenantId;
    }
    return fetchData({
        url: `${tenantEndpoint}${tenantId}`,
        method: FETCH_METHODS.GET,
        skipAuth: false,
        responseHandling: [],
    }).then((response: TenantData & { impressum?: string | null; privacy?: string | null; termsAndConditions?: string | null; secondaryColor?: string | null }) => {
        const checkNull = (value: string | null) => (!value ? '' : value);
        return {
            ...response,
            impressum: checkNull(response.impressum),
            privacy: checkNull(response.privacy),
            termsAndConditions: checkNull(response.termsAndConditions),
            secondaryColor: checkNull(response.secondaryColor),
        };
    });
};

export default getTenantData;
