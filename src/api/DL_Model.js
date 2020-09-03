const khanUrl = "http://mylabcom.ddns.net";
const axios = require("axios");
exports.getImageEvaluation = async (data) => {
  const headerOptions = {
    accept: "application/json",
    "Accept-Language": "en-US,en;q=0.8",
    "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
  };
  return await axios.post(khanUrl, data, { headers: headerOptions });
};
