const multer = require("multer");
const express = require("express");

const {
  registerController,
  loginController,
  authController,
  docController,
  deleteallnotificationController,
  getallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
  downloadDocController,
} = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, PNG, JPEG, and JPG files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter,
});

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/getuserdata", authMiddleware, authController);

router.post("/registerdoc", authMiddleware, docController);

router.get(
  "/getalldoctors",
  authMiddleware,
  getAllDoctorsControllers
);

router.post(
  "/getappointment",
  upload.single("image"),
  authMiddleware,
  appointmentController
);

router.post(
  "/getallnotification",
  authMiddleware,
  getallnotificationController
);

router.post(
  "/deleteallnotification",
  authMiddleware,
  deleteallnotificationController
);

router.get(
  "/getuserappointments",
  authMiddleware,
  getAllUserAppointments
);

router.get(
  "/getDocsforuser",
  authMiddleware,
  getDocsController
);

module.exports = router;