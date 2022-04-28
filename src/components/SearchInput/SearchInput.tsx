import React from "react";

import { Input } from "antd";
import { useTranslation } from "react-i18next";

interface SearchInputProps {
  handleOnSearch?: (query: string) => void;
  handleOnSearchClear?: () => void;
}

function SearchInput({
  handleOnSearch,
  handleOnSearchClear,
}: SearchInputProps) {
  const { t } = useTranslation();
  let timer: ReturnType<typeof setTimeout>;

  const { Search } = Input;

  const onSearchChange = (e: any) => {
    if (handleOnSearch) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (e.target.value.length >= 3) handleOnSearch(e.target.value);
      }, 1000);
    }

    if (e.target.value === "") {
      if (handleOnSearchClear) handleOnSearchClear();
    }
  };
  return (
    <Search
      allowClear
      placeholder={t("search-placeholder")}
      onChange={onSearchChange}
      onSearch={handleOnSearch}
    />
  );
}

export default SearchInput;
