import { Option } from "../components/SelectFormField";

export const convertToOptions = <T>(
  data: T[],
  labelKey: keyof T | Array<keyof T>,
  valueKey: keyof T,
  statusKey?: keyof T
): Option[] => {
  return (
    data?.map((d) => {
      const label =
        labelKey instanceof Array
          ? labelKey.map((key) => d[key]).join(" ")
          : d[labelKey];
      const active = statusKey && String(d[statusKey]) === "ACTIVE";
      return {
        label,
        value: d[valueKey].toString() as unknown,
        active,
      } as Option;
    }) || []
  );
};
