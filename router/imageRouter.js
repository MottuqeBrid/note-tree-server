const express = require("express");
const { verifyToken } = require("../lib/jwt");
const imageSchema = require("../schema/imageSchema");
const UserSchema = require("../schema/UserSchema");
const router = express.Router();

router.post("/upload", verifyToken, async (req, res) => {
  try {
    const { url, group } = req.body;
    const image = await imageSchema.create({ url, group, user: req.user.id });
    const user = await UserSchema.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (!user.image) {
      user.image = [image._id];
    } else {
      user.image.push(image._id);
    }
    await user.save();
    res.status(201).json({ success: true, image });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    const images = await imageSchema.find({ user: req.user.id });
    // short by group
    const groupedImages = images.reduce((acc, image) => {
      (acc[image.group] = acc[image.group] || []).push(image);
      return acc;
    }, {});
    res.status(200).json({ success: true, images: groupedImages });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const image = await imageSchema.findByIdAndDelete(id);
    if (!image) {
      return res.status(404).json({ success: false, error: "Image not found" });
    }
    const user = await UserSchema.findById(req.user.id);
    if (user) {
      user.image.pull(image._id);
      await user.save();
    }
    res
      .status(200)
      .json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
