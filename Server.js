const express = require("express");
const session = require("express-session");
require("dotenv").config();
const app = express();
const { saveProduct } = require("./controllers/uploadProduct.controler");
const upload = require("./middleware/multerMidleware");
const {dynamodb} = require("./configs/AWS.config");



app.use(express.json());
app.use(express.static("Views"));
app.use(express.static("uploads"));
app.use(
  session({
    secret: "session secret key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// config views engine
app.set("view engine", "ejs");
app.set("views", "./Views");

app.get("/", async (req, res) => {
  try {
    let message = req.session?.message || "";
    delete req.session.message;
    const data = await dynamodb
      .scan({ TableName: process.env.DynamoDB_TABLE })
      .promise();

    return res.render("index", { data: data.Items, message: message });
  } catch (err) {
    console.error(err);
  }
});

app.post("/submit", upload.single("image"), saveProduct);

app.post("/delete", upload.fields([]), async (req, res) => {
  const checkList = req.body.checkedList;
  if (checkList) {
    checkList.forEach(async (id) => {
      console.log(id);
      await dynamodb
        .delete({
          TableName: process.env.DynamoDB_TABLE,
          Key: {
            product_id: Number(id),
          },
        })
        .promise();
    });
  }
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
