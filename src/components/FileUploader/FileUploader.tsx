import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

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
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

function FileUploader({ name }: { name: string }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>("");

  const handleChange = (info: InfoProps) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
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
    }
  };

  return (
    <Upload
      name={name}
      listType="picture-card"
      className="fileUploader"
      showUploadList={false}
      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
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
