const express = require("express");
const { hashPassword } = require("../middleware/HashPassword");
const UserSchema = require("../schema/UserSchema");
const { generateToken } = require("../lib/jwt");
const TokenSchema = require("../schema/TokenSchema");
const router = express.Router();

router.post("/register", hashPassword, async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Email and Password are required" });
    }
    const user = await UserSchema.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists" });
    }

    const newUser = await UserSchema.create({ ...req.body });
    const token = generateToken(newUser);
    await TokenSchema.create({
      user: newUser._id,
      token,
    });
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production" || false,
    //   // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    // });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // must be true in prod
      // sameSite: "none", // required for cross-domain
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }
    const user = await UserSchema.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }
    const token = generateToken(user);
    await TokenSchema.create({
      user: user._id,
      token,
    });
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production" || false,
    //   // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    //   expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    // });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // must be true in prod
      sameSite: "none", // required for cross-domain
      domain:
        process.env.NODE_ENV === "production" ? ".toytree.top" : "localhost",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ success: true, message: "Login successful" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});
router.post("/logout", async (req, res) => {
  const { token } = req.cookies;
  res.clearCookie("token");
  await TokenSchema.findOneAndDelete({ token });
  return res.status(200).json({ success: true, message: "Logout successful" });
});
router.get("/profile", async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  try {
    const tokenData = await TokenSchema.findOne({ token });
    if (!tokenData) {
      return res.status(401).json({ success: false, error: "Unauthorized" });
    }
    const user = await UserSchema.findById(tokenData.user);
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        photo: { ...user.photo },
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
