const express = require("express");
const NoteSchema = require("../schema/NoteSchema");
const { verifyToken } = require("../lib/jwt");
const router = express.Router();

router.post("/create", verifyToken, async (req, res) => {
  console.log("user", req.user);
  console.log("req.body", req.body);
  try {
    const newNote = await NoteSchema.create({ ...req.body, user: req.user.id });
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note: newNote,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create note" });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    const notes = await NoteSchema.find({ user: req.user.id }).populate(
      "user",
      "name email"
    );
    res.status(200).json({ success: true, notes });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch notes" });
  }
});

module.exports = router;
