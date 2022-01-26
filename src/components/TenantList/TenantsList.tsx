import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import moment from "moment";
import getCancelTokenSource from "../../api/getCancelTokenSource";
import { TenantData } from "../../types/tenant";
import getFakeMultipleTenants from "../../api/tenant/getFakeMultipleTenants";

function TenantsList() {
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
          content:
            "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später noch einmal",
          duration: 3,
        });
      });

    return () => {
      cancelTokenSource.cancel();
    };
  }, []);

  const columns: any[] = [
    {
      title: "Organisation",
      dataIndex: "name",
      key: "name",
      sorter: (a: TenantData, b: TenantData) => a.name.localeCompare(b.name),
      width: 150,
      ellipsis: true,
      fixed: "left",
    },
    {
      width: 250,
      title: "Subdomain",
      dataIndex: "subdomain",
      ellipsis: true,
      key: "subdomain",
      sorter: (a: TenantData, b: TenantData) =>
        a.subdomain.localeCompare(b.subdomain),
    },
    {
      title: "Hinzugefügt am",
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
      title: "Anzahl von Benutzern",
      width: 150,
      ellipsis: true,
      render: (record: { licensing: { allowedNumberOfUsers: number } }) =>
        record.licensing.allowedNumberOfUsers,
      sorter: (a: TenantData, b: TenantData) =>
        a.licensing.allowedNumberOfUsers - b.licensing.allowedNumberOfUsers,
    },
  ];

  return (
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
    />
  );
}

export default TenantsList;
