const userSchema = require("../models/UserModel");

module.exports = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user || !user.isDoctor) {
      return res.status(403).send({
        message: "Access denied. Doctor authorization required.",
        success: false,
      });
    }
    next();
  } catch (error) {
    console.error("Doctor middleware error:", error);
    return res.status(500).send({
      message: "Role authorization failed",
      success: false,
    });
  }
};
