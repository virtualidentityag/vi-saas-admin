import { FETCH_ERRORS, fetchData } from '../fetchData';
import { agencyPostcodeRangeEndpointBase } from '../../appConfig';

const getPostCodeRangeRequestBodyFromForm = (formData: Record<string, any>) => {
    let postcodeRanges = '';

    if (formData.postCodeRangesActive) {
        let i = 0;
        while (i >= 0) {
            const postcodeFrom = formData[`postcodeFrom_${i}`];
            const postcodeUntil = formData[`postcodeTo_${i}`];
            // eslint-disable-next-line import/namespace
            if (postcodeFrom !== undefined) {
                postcodeRanges = `${postcodeRanges + postcodeFrom}-${postcodeUntil};`;
                i += 1;
            } else {
                const { postcodeFromAdd } = formData;
                const { postcodeUntilAdd } = formData;

                if (
                    postcodeFromAdd !== undefined &&
                    postcodeUntilAdd !== null &&
                    postcodeFromAdd !== '' &&
                    postcodeUntilAdd !== ''
                ) {
                    postcodeRanges = `${postcodeRanges + postcodeFromAdd}-${postcodeUntilAdd};`;
                }
                break;
            }
        }
    }

    if (!formData.postCodeRangesActive || postcodeRanges === '') {
        postcodeRanges = '00000-99999;';
    }

    return {
        postcodeRanges,
    };
};

/**
 * add new agency postcode range
 * @param agencyData
 * @return data
 */
const updateAgencyPostCodeRange = (id: string, formData: Record<string, any>, method: string) => {
    const postcodeRange = getPostCodeRangeRequestBodyFromForm(formData);
    if (method === 'POST') {
        return fetchData({
            url: `${agencyPostcodeRangeEndpointBase}/${id}`,
            method: 'POST',
            skipAuth: false,
            responseHandling: [FETCH_ERRORS.CATCH_ALL],
            bodyData: JSON.stringify(postcodeRange),
        }).then(() => id);
    }
    return fetchData({
        url: `${agencyPostcodeRangeEndpointBase}/${id}`,
        method: 'DELETE',
        skipAuth: false,
        responseHandling: [FETCH_ERRORS.CATCH_ALL],
    })
        .catch(() => null)
        .then(() => {
            return fetchData({
                url: `${agencyPostcodeRangeEndpointBase}/${id}`,
                method: 'POST',
                skipAuth: false,
                responseHandling: [FETCH_ERRORS.CATCH_ALL],
                bodyData: JSON.stringify(postcodeRange),
            });
        });
};

export default updateAgencyPostCodeRange;
