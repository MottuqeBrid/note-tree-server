const mongoose = require("mongoose");

const OtherSchema = new mongoose.Schema(
  {
    coverDemo: {
      title: { type: String },
      courseTitle: { type: String },
      section: { type: String },
      courseCode: { type: String },
      studentName: { type: String },
      studentId: { type: String },
      year: { type: String },
      term: { type: String },
      teacherName: { type: String },
      studentDiscipline: { type: String },
      teacherDiscipline: { type: String },
      degree: { type: String },
      date: { type: Date }, // stored as YYYY-MM-DD
      studentInstitute: { type: String },
      teacherInstitute: { type: String },
      coverType: {
        type: String,
        enum: ["assignment", "lab test"],
      },
      category: { type: String },
    },
    hero: {
      image: { type: String },
      subSlogan: { type: String },
      slogan: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Other", OtherSchema);
