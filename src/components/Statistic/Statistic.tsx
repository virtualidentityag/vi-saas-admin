import { useEffect, useState } from "react";
import Title from "antd/es/typography/Title";
import { useTranslation } from "react-i18next";
import { FileDownloadOutlined } from "@mui/icons-material";
import { CSVLink } from "react-csv";
import getRegistrationData from "../../api/statistic/getRegistrationData";
import {
  RegistrationData,
  RegistrationStatistics,
} from "../../types/registrationData";

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
      .then(
        (response: RegistrationData) => response?.registrationStatistics || []
      )
      .catch(() => [] as RegistrationStatistics[])
      .then((registrationStatistics: RegistrationStatistics[]) => {
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
          "betend",
        ]);
        registrationStatistics.forEach(function createCsvLine(entry) {
          const csvLine: string[] = [];

          let formattedTopics = "";
          const topics = entry.topicsInternalAttributes;
          topics.forEach(function concateTopics(topic) {
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
          csvLine.push(entry.endDate);

          data.push(csvLine);
        });
        setCsvData(data);

        setIsRequestInProgress(false);
      });
  }, []);

  return (
    <>
      <Title level={3}>{t("statistic.title")}</Title>
      <div className="statistic">
        <div className="statistic__headline">{t("statistic.title.text")}</div>
        <div className="statistic__download">
          {t("statistic.download.text")}
        </div>
        <div className="statistic__download">
          <CSVLink
            separator=";"
            data={csvData}
            filename={`${t("statistic.download.filename")}.csv`}
          >
            <span className="statistic__icon">
              <FileDownloadOutlined />
            </span>
            <span className="statistic__text">
              {t("statistic.download.link")}
            </span>
          </CSVLink>{" "}
        </div>
      </div>
    </>
  );
}
