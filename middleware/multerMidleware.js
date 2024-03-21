
const path = require("path");
const multer = require("multer");
const storage = multer.memoryStorage({
  destination : (req,rep, cb) => {
    cb(null, "./uploads");
  }
});
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 2000000 },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!", false);
  }
};

module.exports = upload;
