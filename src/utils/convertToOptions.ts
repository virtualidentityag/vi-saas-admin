import { Option } from '../components/SelectFormField';

export const convertToOptions = <T>(
    data: T[],
    labelKey: keyof T | Array<keyof T>,
    valueKey: keyof T,
    filterEmptyValues = false,
): Option[] => {
    const finalData = filterEmptyValues
        ? data?.filter((tmpData) => tmpData[valueKey] !== null && tmpData[valueKey] !== undefined)
        : data;

    return (
        finalData?.map((d) => {
            const label = labelKey instanceof Array ? labelKey.map((key) => d[key]).join(' ') : d[labelKey];
            return {
                label,
                value: d[valueKey]?.toString() as unknown,
            } as Option;
        }) || []
    );
};
