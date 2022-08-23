import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import { FileDownloadOutlined } from "@mui/icons-material";
import { CSVLink } from "react-csv";
import getRegistrationData from "../../api/statistic/getRegistrationData";
import { RegistrationData } from "../../types/registrationData";

const isRegistrationDataFetched = false;

export function Statistic() {
  const { t } = useTranslation();
  const [isRequestInProgress, setIsRequestInProgress] =
    useState<boolean>(false);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    if (isRegistrationDataFetched) return;
    if (isRequestInProgress) return;

    setIsRequestInProgress(true);
    getRegistrationData()
      .then((response: RegistrationData) => {
        const data = [];
        data.push([
          "user_id",
          "datum_registrierung",
          "alter",
          "geschl",
          "betrgru",
          "Themen in der Registrierung",
          "relevant",
          "plz",
        ]);
        response.registrationStatistics.forEach(function (entry) {
          const csvLine: string[] = [];

          let formattedTopics = "";
          const topics = entry.topicsInternalAttributes;
          topics.forEach(function (topic) {
            if (formattedTopics !== "") {
              formattedTopics += ", ";
            }
            formattedTopics += topic;
          });

          csvLine.push(entry.userId);
          csvLine.push(entry.registrationDate);
          csvLine.push(entry.age !== null ? entry.age.toString() : "");
          csvLine.push(entry.gender || "");
          csvLine.push(entry.counsellingRelation || "");
          csvLine.push(formattedTopics);
          csvLine.push(entry.mainTopicInternalAttribute || "");
          csvLine.push(entry.postalCode);

          data.push(csvLine);
        });

        setCsvData(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsRequestInProgress(false);
      });
  }, []);

  return (
    <>
      <Title level={3}>{t("statistic.title")}</Title>
      <div className="box">
        <div className="box__headline">{t("statistic.title.text")}</div>
        <div className="box__download">{t("statistic.download.text")}</div>
        <div className="box__download">
          <CSVLink
            separator=";"
            data={csvData}
            filename={`${t("statistic.download.filename")}.csv`}
          >
            <span className="box__icon">
              <FileDownloadOutlined />
            </span>
            <span className="box__text">{t("statistic.download.link")}</span>
          </CSVLink>{" "}
        </div>
      </div>
    </>
  );
}
