const AWS = require("aws-sdk");
AWS.config.update({
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
});

const dynamodb = new AWS.DynamoDB.DocumentClient();

module.exports = { AWS, dynamodb };

// const AWS = require("aws-sdk");
// // require("dotenv").config();

// AWS.config.update({
//   region: process.env.REGION,
//   accessKeyId: process.env.ACCESS_KEY,
//   secretAccessKey: process.SECRET_ACCESS_KEY,
// });

// console.log(process.env.REGION);
// console.log(process.env.ACCESS_KEY);
// console.log(process.env.SECRET_ACCESS_KEY);

// // const s3 = new AWS.S3()
// const dynamodb = new AWS.DynamoDB.DocumentClient()

// module.exports = {AWS, dynamodb}
