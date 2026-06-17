const userSchema = require("../models/UserModel");

module.exports = async (req, res, next) => {
  try {
    const user = await userSchema.findById(req.body.userId);
    if (!user || !user.isAdmin) {
      return res.status(403).send({
        message: "Access denied. Admin authorization required.",
        success: false,
      });
    }
    next();
  } catch (error) {
    console.error("Admin middleware error:", error);
    return res.status(500).send({
      message: "Role authorization failed",
      success: false,
    });
  }
};
