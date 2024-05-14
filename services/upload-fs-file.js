const AWS = require("aws-sdk");

const keys = require("../config/keys").aws;

var fs = require("fs");

const uploadFromFile = async (path, fileName) => {
  const fileData = fs.readFileSync(path);

  const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    region: keys.region,
  });

  const params = {
    Bucket: keys.bucketName,
    Key: fileName,
    Body: fileData,
    ACL: "public-read",
  };

  const s3Response = await s3.upload(params).promise();

  //   if (removeFile) {
  fs.unlink(path, (err) => {
    if (err) console.log("error unlinking file: ", err);
  });
  //   }

  return s3Response;
};

module.exports = uploadFromFile;
