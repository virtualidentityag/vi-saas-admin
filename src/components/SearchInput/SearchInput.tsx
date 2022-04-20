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

  const { Search } = Input;

  // TODO DEFINE CORRECT TYPE
  const onSearchChange = (e: any) => {
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
