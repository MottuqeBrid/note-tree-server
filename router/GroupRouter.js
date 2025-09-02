const expres = require("express");
const { verifyToken } = require("../lib/jwt");
const GroupSchema = require("../schema/GroupSchema");
const UserSchema = require("../schema/UserSchema");
const router = expres.Router();

router.post("/create", verifyToken, async (req, res) => {
  console.log("Request Body:", req.body); // Debugging line
  try {
    const user = await UserSchema.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const group = await GroupSchema.create({ ...req.body, user: req.user.id });
    if (!user.groups) {
      user.groups = [group._id];
    }
    user.groups.push(group._id);
    await user.save();
    res.status(201).json({ success: true, group });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.patch("/update/:id", verifyToken, async (req, res) => {
  const { members, ...updates } = req.body;

  if (members && members.length > 0) {
    members.forEach(async (memberId) => {
      const user = await UserSchema.findById(memberId);
      if (user) {
        if (!user.groups) {
          user.groups = [req.params.id];
        }
        user.groups.push(req.params.id);
        await user.save();
      }
    });
  }

  try {
    const group = await GroupSchema.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!group) {
      return res.status(404).json({ success: false, error: "Group not found" });
    }
    res.status(200).json({ success: true, group });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.delete("/delete/:id", verifyToken, async (req, res) => {
  try {
    const group = await GroupSchema.findByIdAndDelete(req.params.id);
    if (!group) {
      return res.status(404).json({ success: false, error: "Group not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Group deleted successfully" });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

router.get("/all", verifyToken, async (req, res) => {
  try {
    const groups = await GroupSchema.find();
    res.status(200).json({ success: true, groups });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// get user
router.get("/all-users", verifyToken, async (req, res) => {
  try {
    const users = await UserSchema.find({ isDeleted: false, isBanned: false });
    res.status(200).json({ success: true, users });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

module.exports = router;
