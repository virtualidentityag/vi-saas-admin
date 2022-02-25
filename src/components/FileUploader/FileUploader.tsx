import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { UploadFile } from "antd/es/upload/interface";
import i18n from "../../i18n";

function getBase64(
  img: Record<string, any>,
  callback: (result: string | ArrayBuffer | null) => void
) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img as Blob);
}

interface FileProps {
  size: number;
  type: string;
}

interface InfoProps {
  file: Record<string, any>;
}

function beforeUpload(file: FileProps) {
  console.log("beforeupload", file);
  const { t } = i18n;
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error(t("message.error.upload.filetype"));
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error(t("message.error.upload.filesize"));
  }
  return false;
}

function FileUploader({ name }: { name: string }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>("");

  const handleChange = (info: InfoProps) => {
    console.log("upload", info);

    // Get this url from response in real world.
    getBase64(
      info.file.originFileObj,
      (imgUrl: string | ArrayBuffer | null) => {
        setLoading(false);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        setImageUrl(imgUrl);
      }
    );

    setLoading(true);
  };

  return (
    <Upload
      name="upload"
      listType="picture-card"
      className="fileUploader"
      showUploadList={false}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} style={{ width: "100%" }} />
      ) : (
        <div>
          {loading ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>{t("btn.upload")}</div>
        </div>
      )}
    </Upload>
  );
}

export default FileUploader;
