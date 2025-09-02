const mongoose = require("mongoose");

const OtherSchema = new mongoose.Schema(
  {
    coverDemo: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Other", OtherSchema);
