const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
};
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
const decodeToken = (token) => {
  return jwt.decode(token);
};
module.exports = { generateToken, verifyToken, decodeToken };
