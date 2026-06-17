const docSchema = require("../models/DocModel");
const appointmentSchema = require("../models/AppointmentModel");
const userSchema = require("../models/UserModel");
const fs = require("fs");
const path = require("path");

const updateDoctorProfileController = async (req, res) => {
  try {
    console.log(req.body);

    const doctor = await docSchema.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );

    await doctor.save();

    return res.status(200).send({
      success: true,
      data: doctor,
      message: "Successfully updated profile",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
      success: false,
    });
  }
};

const getAllDoctorAppointmentsController = async (req, res) => {
  try {
    const doctor = await docSchema.findOne({
      userId: req.body.userId,
    });

    const allAppointments = await appointmentSchema.find({
      doctorId: doctor._id,
    });

    return res.status(200).send({
      message: "All the appointments are listed below.",
      success: true,
      data: allAppointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
      success: false,
    });
  }
};

const handleStatusController = async (req, res) => {
  try {
    const appointment = await appointmentSchema.findById(
      req.body.appointmentId
    );

    if (!appointment) {
      return res.status(404).send({
        message: "Appointment not found",
      });
    }

    appointment.status = req.body.status;
    await appointment.save();

    const user = await userSchema.findById(appointment.userId);

    user.notification.push({
      type: "status-updated",
      message: `Your appointment status has been updated to ${req.body.status}`,
      onClickPath: "/appointments",
    });

    await user.save();

    return res.status(200).send({
      success: true,
      message: "Appointment status updated successfully",
      data: appointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
      success: false,
    });
  }
};

const documentDownloadController = async (req, res) => {
  try {
    const appointId = req.query.appointId;

    const appointment = await appointmentSchema.findById(appointId);

    if (!appointment) {
      return res.status(404).send({
        message: "Appointment not found",
      });
    }

    const isPatient = appointment.userId.toString() === req.body.userId;
    let isDoc = false;
    const doctorDoc = await docSchema.findOne({ _id: appointment.doctorId, userId: req.body.userId });
    if (doctorDoc) {
      isDoc = true;
    }

    if (!isPatient && !isDoc) {
      return res.status(403).send({
        message: "Unauthorized access: you are not authorized to download this document",
        success: false,
      });
    }

    const documentUrl = appointment.document?.path;

    if (!documentUrl || typeof documentUrl !== "string") {
      return res.status(400).send({
        message: "Document URL is invalid",
        success: false,
      });
    }

    const absoluteFilePath = path.join(__dirname, "..", documentUrl);

    fs.access(absoluteFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        return res.status(404).send({
          message: "File not found",
          success: false,
          error: err,
        });
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(absoluteFilePath)}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      const fileStream = fs.createReadStream(absoluteFilePath);

      fileStream.on("error", (error) => {
        console.log(error);
        return res.status(500).send({
          message: "Error reading the document",
          success: false,
          error: error,
        });
      });

      fileStream.pipe(res);

      fileStream.on("end", () => {
        console.log("File download completed.");
        res.end();
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Something went wrong",
      success: false,
    });
  }
};

module.exports = {
  updateDoctorProfileController,
  getAllDoctorAppointmentsController,
  handleStatusController,
  documentDownloadController,
};