const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
    phone: {
      type: String,
    },
    photo: {
      profile: {
        type: String,
        default:
          "https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      cover: {
        type: String,
      },
    },
    deactivated: {
      type: Boolean,
      default: false,
    },
    isbanned: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    bio: {
      type: String,
    },
    location: {
      permanentAddress: {
        type: String,
      },
      currentAddress: {
        type: String,
      },
      country: {
        type: String,
        default: "Bangladesh",
      },
    },
    social: {
      facebook: {
        type: String,
      },
      twitter: {
        type: String,
      },
      instagram: {
        type: String,
      },
      github: {
        type: String,
      },
      linkedin: {
        type: String,
      },
      website: {
        type: String,
      },
      portfolio: {
        type: String,
      },
      youtube: {
        type: String,
      },
      tiktok: {
        type: String,
      },
      snapchat: {
        type: String,
      },
      reddit: {
        type: String,
      },
      quora: {
        type: String,
      },
    },
    hobbies: {
      type: [String],
    },
    education: {
      institution: {
        type: String,
      },
      degree: {
        type: String,
      },
      fieldOfStudy: {
        type: String,
      },
      startYear: {
        type: Number,
      },
      endYear: {
        type: Number,
      },
    },
    note: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
    cover: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cover",
      },
    ],
    image: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image",
      },
    ],
  },
  {
    timestamps: true,
  }
);
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
