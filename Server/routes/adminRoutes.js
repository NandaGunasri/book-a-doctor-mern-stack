const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllUsersControllers,
  getAllDoctorsControllers,
  getStatusApproveController,
  getStatusRejectController,
  displayAllAppointmentController,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/getallusers", authMiddleware, adminMiddleware, getAllUsersControllers);

router.get("/getalldoctors", authMiddleware, adminMiddleware, getAllDoctorsControllers);

router.post("/getapprove", authMiddleware, adminMiddleware, getStatusApproveController);

router.post("/getreject", authMiddleware, adminMiddleware, getStatusRejectController);

router.get(
  "/getallAppointmentsAdmin",
  authMiddleware,
  adminMiddleware,
  displayAllAppointmentController
);

module.exports = router;