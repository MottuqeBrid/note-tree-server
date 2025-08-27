const express = require("express");
const CoverSchema = require("../schema/CoverSchema");
const { verifyToken } = require("../lib/jwt");
const UserSchema = require("../schema/UserSchema");
const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  try {
    const cover = await CoverSchema.create({ ...req.body, user: req.user.id });
    const user = await UserSchema.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (!user.cover) {
      user.cover = [cover._id];
    } else {
      user.cover.push(cover._id);
    }
    await user.save();
    res.status(201).json({ success: true, cover });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
