const express = require("express");
const { verifyToken } = require("../lib/jwt");
const UserSchema = require("../schema/UserSchema");
const { checkAdmin } = require("../middleware/checkAdmin");
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

router.get("/middleware", verifyToken, async (req, res) => {
  const { id } = req.user;
  try {
    // এখানে select ব্যবহার করো
    const user = await UserSchema.findById(id).select(
      "-password -__v -note -name -cover -image -location -photo "
    );

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

router.patch("/me", verifyToken, async (req, res) => {
  const { id } = req.user;
  const { password, ...updates } = req.body;
  console.log(id);
  try {
    const updatedUser = await UserSchema.findById(id);
    updatedUser.set(updates);
    await updatedUser.save();
    console.log(updatedUser);
    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/single/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    if (id !== req.user.id) {
      return res.status(200).json({ success: false, message: "Access denied" });
    }
    const user = await UserSchema.findById(id).select("-password -__v");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.get("/dashboard/summary", verifyToken, async (req, res) => {
  try {
    const user = await UserSchema.findById(req.user.id).populate("note");
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// admin routes
router.get("/admin/users", verifyToken, checkAdmin, async (req, res) => {
  try {
    const users = await UserSchema.find().select("-password -__v");
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
router.patch("/admin/users/:id", verifyToken, checkAdmin, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const user = await UserSchema.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

router.delete("/admin/users/:id", verifyToken, checkAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserSchema.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
