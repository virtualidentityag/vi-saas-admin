import React, { useEffect, useState } from "react";
import { Table, Button, message } from "antd";
import moment from "moment";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";
import getCancelTokenSource from "../../api/getCancelTokenSource";
import { TenantData } from "../../types/tenant";
import getFakeMultipleTenants from "../../api/tenant/getFakeMultipleTenants";

function TenantsList() {
  const { t } = useTranslation();
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const cancelTokenSource = getCancelTokenSource();
    getFakeMultipleTenants(cancelTokenSource)
      .then((result: any) => {
        setIsLoading(false);
        setTenants(result);
      })
      .catch(() => {
        setIsLoading(false);
        message.error({
          content: t("message.error.default"),
          duration: 3,
        });
      });

    return () => {
      cancelTokenSource.cancel();
    };
  }, [t]);

  const columns: any[] = [
    {
      title: t("organisation.title"),
      dataIndex: "name",
      key: "name",
      sorter: (a: TenantData, b: TenantData) => a.name.localeCompare(b.name),
      width: 150,
      ellipsis: true,
      fixed: "left",
    },
    {
      width: 250,
      title: t("organisation.subdomain"),
      dataIndex: "subdomain",
      ellipsis: true,
      key: "subdomain",
      /* sorter: (a: TenantData, b: TenantData) =>
        a.subdomain.localeCompare(b.subdomain), */
    },
    {
      title: t("createDate"),
      dataIndex: "createDate",
      key: "createDate",
      ellipsis: true,
      width: 150,
      sorter: (a: TenantData, b: TenantData) =>
        moment(a.createDate).unix() - moment(b.createDate).unix(),
      render: (date: Date) => {
        return <span> {date.toLocaleDateString("de-DE")}</span>;
      },
    },
    {
      title: t("organisation.allowedNumberOfUsers"),
      width: 150,
      ellipsis: true,
      render: (record: { licensing: { allowedNumberOfUsers: number } }) =>
        record.licensing.allowedNumberOfUsers,
      /* sorter: (a: TenantData, b: TenantData) =>
        a.licensing.allowedNumberOfUsers - b.licensing.allowedNumberOfUsers, */
    },
  ];

  return (
    <>
      <Title level={3}>{t("organisations.title")}</Title>
      <p>{t("organisations.title.text")}</p>
      <Button type="primary" icon={<PlusOutlined />}>
        {t("new")}
      </Button>
      <Table
        loading={isLoading}
        className="tenantsTable"
        dataSource={tenants}
        columns={columns}
        scroll={{
          x: "max-content",
          y: "100%",
        }}
        sticky
        tableLayout="fixed"
        // bordered
      />
    </>
  );
}

export default TenantsList;
