const express = require("express");
const session = require("express-session");
const multer = require("multer");
const data = require("./Data.js");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

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

app.get("/", (req, res) => {
  let message = req.session?.message || "";
  delete req.session.message;
  return res.render("index", { data: data, message: message });
});

app.post("/submit", upload.single("image"), (req, res) => {
  const { productId, name, quanlity } = req.body;
  const image = req.file;
  console.log(image.path);
  const check = data.find((item) => item.productId === productId);
  if (check) {
    if (check.name === name) {
      check.quanlity = parseInt(check.quanlity) + parseInt(quanlity);
    } else {
      req.session.message = "Product ID already exists";
    }
  } else {
    data.push({
      productId,
      name,
      quanlity,
      image: image.originalname,
    });
  }
  console.log(data);
  return res.redirect("/");
});

app.post("/delete", upload.fields([]), (req, res) => {
  const checkList = req.body.checkedList;
  if (checkList) {
    checkList.forEach((id) => {
      data.splice(
        data.findIndex((item) => item.productId === id),
        1
      );
    });
  }
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
