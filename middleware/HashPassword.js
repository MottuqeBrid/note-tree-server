const bcrypt = require("bcrypt");

const hashPassword = (req, res, next) => {
  const saltRounds = 12;

  if (req.body.password) {
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Hashing failed" });
      }
      req.body.password = hash;
      next();
    });
  } else {
    next();
  }
};

module.exports = { hashPassword };
