const getBase64 = (
  img: Record<string, any>,
  callback: (result: string | ArrayBuffer | null) => void
) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  console.log("getBAse64");
  reader.readAsDataURL(img as Blob);
};

export default getBase64;
