const express = require("express");
const { verifyToken } = require("../lib/jwt");
const UserSchema = require("../schema/UserSchema");
const router = express.Router();

router.get("/me", verifyToken, async (req, res) => {
  const { id } = req.user;
  console.log(req.user);

  try {
    const user = await UserSchema.findById(id)
      .populate("note")
      .select("-password -__v");
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
