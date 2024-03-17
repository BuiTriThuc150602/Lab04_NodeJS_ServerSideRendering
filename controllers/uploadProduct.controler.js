const {AWS, dynamodb} = require("../configs/AWS.config");
const s3 = new AWS.S3();



exports.saveProduct = (req, res) => {
  const { product_id, name, quanlity } = req.body;
  const image = req.file?.originalname.split(".");
  const fileType = image[image.length - 1];
  const filePath = `${product_id}_${Date.now().toString()}.${fileType}`;
  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: filePath,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, async (err, data) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    try {
      await dynamodb
        .put({
          TableName: process.env.DynamoDB_TABLE,
          Item: {
            product_id: Number(product_id),
            name: name,
            quanlity: Number(quanlity),
            image: data.Location,
          },
        })
        .promise();
      req.session.message = "Add product successfully";
      return res.redirect("/");
    } catch (err) {
      console.error(err);
    }
  });
};
