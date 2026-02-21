import { fetchData, FETCH_METHODS, FETCH_ERRORS } from '../fetchData';
import { baseTenantPublicEndpoint } from '../../appConfig';
import getLocationVariables from '../../utils/getLocationVariables';
import { AppConfigInterface } from '../../types/AppConfigInterface';

/**
 * retrieve all needed public tenant data
 * @return data
 */
const getPublicTenantData = (settings: AppConfigInterface) => {
    const { subdomain, origin } = getLocationVariables();
    const fallbackSlug = origin.includes('localhost')
        ? (import.meta.env.VITE_TENANT_SLUG as string) || 'happylife'
        : undefined;
    const slug = settings.multitenancyWithSingleDomainEnabled
        ? settings.mainTenantSubdomainForSingleDomainMultitenancy
        : subdomain || fallbackSlug;
    if (slug) {
        return fetchData({
            url: `${baseTenantPublicEndpoint}/${slug}`,
            method: FETCH_METHODS.GET,
            skipAuth: true,
            responseHandling: [FETCH_ERRORS.NO_MATCH],
        });
    }
    return Promise.reject(new Error('No tenant slug available'));
};

export default getPublicTenantData;
