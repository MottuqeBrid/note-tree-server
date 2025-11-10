const express = require("express");
const CoverSchema = require("../schema/CoverSchema");
const { verifyToken } = require("../lib/jwt");
const UserSchema = require("../schema/UserSchema");
const OtherSchema = require("../schema/OtherSchema");
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

router.get("/my-covers", verifyToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id).populate("cover");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, covers: user.cover });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    const covers = await CoverSchema.find()
      .populate("user")
      .select("-__v -password")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, covers });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/demo", async (req, res) => {
  try {
    const demoCover = {
      title: "Assignment 02: Graph Traversal Analysis",
      courseTitle: "Data Structures & Algorithms",
      section: "B",
      courseCode: "0542 3101 CSE",
      studentName: "John Doe",
      studentId: "210324",
      year: "3rd Year",
      term: "1st Term",
      teacherName: "Dr. Amelia Howard",
      studentDiscipline: "Computer Science & Engineering",
      teacherDiscipline: "Algorithms & Complexity",
      degree: "B.Sc. Engineering",
      date: new Date().toISOString().slice(0, 10),
      studentInstitute: "Global Tech University",
      teacherInstitute: "Global Tech University",
      coverType: "assignment",
      category: "design4",
    };

    const coverDemo = await OtherSchema.findOne().sort({ createdAt: -1 });

    res
      .status(200)
      .json({ success: true, cover: coverDemo.coverDemo || demoCover });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const cover = await CoverSchema.findById(id);
    if (!cover) {
      return res.status(404).json({ success: false, error: "Cover not found" });
    }
    const user = await UserSchema.findById(cover.user);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    if (user) {
      user.cover.pull(cover._id);
      await user.save();
    }
    await CoverSchema.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Cover deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
