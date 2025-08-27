const UserSchema = require("../schema/UserSchema");

const checkAdmin = async (req, res, next) => {
  const { id } = req.user;
  try {
    const user = await UserSchema.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "Forbidden" });
    }
    if (user.role.trim() !== "admin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    if (user.role === "admin") {
      return next();
    }
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
  return res.status(403).json({ success: false, message: "Forbidden" });
};

module.exports = { checkAdmin };
