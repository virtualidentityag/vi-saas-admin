import { Option } from "../components/SelectFormField";

export const convertToOptions = <T>(
  data: T[],
  labelKey: keyof T | Array<keyof T>,
  valueKey: keyof T
): Option[] => {
  return (
    data?.map((d) => {
      const label =
        labelKey instanceof Array
          ? labelKey.map((key) => d[key]).join(" ")
          : d[labelKey as keyof T];
      return { label, value: d[valueKey].toString() as unknown } as Option;
    }) || []
  );
};
