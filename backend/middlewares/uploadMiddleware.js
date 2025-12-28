import multer from "multer";
import path from "path";

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images(jpeg,jpg,png) are allowed"));
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets/avatar");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + path.extname(file.originalname));
  },
});

export const upload = multer({
  storage,
  limits: { fieldSize: 2 * 1024 * 1024 },
  fileFilter,
});
