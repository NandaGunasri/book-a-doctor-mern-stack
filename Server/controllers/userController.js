const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = require("../models/UserModel");
const docSchema = require("../models/DocModel");
const appointmentSchema = require("../models/AppointmentModel");
const path = require("path");
const fs = require("fs");

// Register Controller
const registerController = async (req, res) => {
  try {
    const { email, password, fullName, phone, type } = req.body;

    const existingUser = await userSchema.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        message: "User already exists",
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userSchema({
      fullName,
      email,
      password: hashedPassword,
      phone,
      isAdmin: type === "admin" ? true : false,
      isDoctor: false,
    });

    await newUser.save();

    return res.status(201).send({
      message: "Registered Successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: `Register Controller Error: ${error.message}`,
      success: false,
    });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userSchema.findOne({ email });
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(200).send({
        message: "Invalid Email or Password",
        success: false,
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_KEY, {
      expiresIn: "1d",
    });

    const type = user.isAdmin ? "admin" : (user.isDoctor ? "doctor" : "user");

    const userData = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      isDoctor: user.isDoctor,
      notification: user.notification,
      seennotification: user.seennotification,
      type,
    };

    return res.status(200).send({
      message: "Login successfully",
      success: true,
      token,
      userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: `Login Controller Error: ${error.message}`,
      success: false,
    });
  }
};

// Auth Controller
const authController = async (req, res) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }

    user.password = undefined;

    const type = user.isAdmin ? "admin" : (user.isDoctor ? "doctor" : "user");
    const data = {
      ...user._doc,
      type,
    };

    return res.status(200).send({
      success: true,
      data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Authentication error",
      success: false,
      error,
    });
  }
};

// Apply Doctor Controller
const docController = async (req, res) => {
  try {
    const { doctor, userId } = req.body;

    const newDoctor = new docSchema({
      ...doctor,
      userId,
      status: "pending",
    });

    await newDoctor.save();

    // Notify all admins
    const admins = await userSchema.find({ isAdmin: true });
    for (let admin of admins) {
      admin.notification.push({
        type: "apply-doctor-request",
        message: `${doctor.fullName} has applied for a doctor account`,
        onClickPath: "/adminHome",
      });
      await admin.save();
    }

    return res.status(201).send({
      success: true,
      message: "Doctor Registration request sent successfully",
      data: newDoctor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      message: "Error applying as doctor",
      success: false,
      error,
    });
  }
};

// Mark all notifications as read
const getallnotificationController = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }

    const unreadNotifications = user.notification;
    user.seennotification = [...user.seennotification, ...unreadNotifications];
    user.notification = [];

    await user.save();

    const type = user.isAdmin ? "admin" : (user.isDoctor ? "doctor" : "user");
    const updatedUser = {
      ...user._doc,
      type,
    };

    return res.status(200).send({
      success: true,
      message: "All notifications marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error marking notifications as read",
      error,
    });
  }
};

// Delete all read notifications
const deleteallnotificationController = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userSchema.findById(userId);
    if (!user) {
      return res.status(200).send({
        message: "User not found",
        success: false,
      });
    }

    user.seennotification = [];
    await user.save();

    const type = user.isAdmin ? "admin" : (user.isDoctor ? "doctor" : "user");
    const updatedUser = {
      ...user._doc,
      type,
    };

    return res.status(200).send({
      success: true,
      message: "All notifications deleted successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error deleting notifications",
      error,
    });
  }
};

// Get all approved doctors for users
const getAllDoctorsControllers = async (req, res) => {
  try {
    const doctors = await docSchema.find({ status: "approved" });
    return res.status(200).send({
      success: true,
      message: "Doctors list fetched successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching doctors list",
      error,
    });
  }
};

// Book Appointment Controller
const appointmentController = async (req, res) => {
  try {
    const { date, userId, doctorId } = req.body;
    let userInfo = req.body.userInfo;
    let doctorInfo = req.body.doctorInfo;

    // Parse stringified objects if they are sent as strings in FormData
    if (typeof userInfo === "string") {
      userInfo = JSON.parse(userInfo);
    }
    if (typeof doctorInfo === "string") {
      doctorInfo = JSON.parse(doctorInfo);
    }

    let documentObj = null;
    if (req.file) {
      documentObj = {
        path: req.file.path,
        name: req.file.originalname,
      };
    }

    const newAppointment = new appointmentSchema({
      userId,
      doctorId,
      userInfo,
      doctorInfo,
      date,
      document: documentObj,
      status: "pending",
    });

    await newAppointment.save();

    // Notify Doctor (found via doctorInfo.userId or doctor doc's userId)
    let docUserId = doctorInfo.userId;
    if (!docUserId) {
      const doctorDoc = await docSchema.findById(doctorId || doctorInfo._id);
      if (doctorDoc) {
        docUserId = doctorDoc.userId;
      }
    }
    const docUser = await userSchema.findById(docUserId);
    if (docUser) {
      docUser.notification.push({
        type: "new-appointment-request",
        message: `A new appointment request has been booked by ${userInfo.fullName}`,
        onClickPath: "/doctorHome",
      });
      await docUser.save();
    }

    return res.status(201).send({
      success: true,
      message: "Appointment booked successfully",
      data: newAppointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error booking appointment",
      error,
    });
  }
};

// Get all user appointments
const getAllUserAppointments = async (req, res) => {
  try {
    const appointments = await appointmentSchema.find({ userId: req.body.userId });
    return res.status(200).send({
      success: true,
      message: "User appointments fetched successfully",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching user appointments",
      error,
    });
  }
};

// Get Documents for user (returns all documents from user's appointments)
const getDocsController = async (req, res) => {
  try {
    const appointments = await appointmentSchema.find({
      userId: req.body.userId,
      document: { $ne: null },
    });
    const documents = appointments.map((app) => ({
      appointmentId: app._id,
      doctorName: app.doctorInfo.fullName,
      date: app.date,
      document: app.document,
    }));
    return res.status(200).send({
      success: true,
      message: "User documents fetched successfully",
      data: documents,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching user documents",
      error,
    });
  }
};

// Download Document Controller for User
const downloadDocController = async (req, res) => {
  try {
    const appointId = req.query.appointId;
    const appointment = await appointmentSchema.findById(appointId);

    if (!appointment) {
      return res.status(404).send({
        message: "Appointment not found",
        success: false,
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
    if (!documentUrl) {
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
        });
      }

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${path.basename(absoluteFilePath)}"`
      );
      res.setHeader("Content-Type", "application/octet-stream");

      const fileStream = fs.createReadStream(absoluteFilePath);
      fileStream.pipe(res);
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
  registerController,
  loginController,
  authController,
  docController,
  getallnotificationController,
  deleteallnotificationController,
  getAllDoctorsControllers,
  appointmentController,
  getAllUserAppointments,
  getDocsController,
  downloadDocController,
};
