/* eslint-disable @typescript-eslint/no-explicit-any */
export const getBase64 = (file: File, callback: any) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    callback(reader.result);
  };
  reader.onerror = function (error) {
    console.log("Error: ", error);
  };
};
