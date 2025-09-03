const mongoose = require("mongoose");

const GroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
    },
    privacy: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    post: {
      image: [
        {
          type: String,
        },
      ],
      title: {
        type: String,
      },
      description: {
        type: String,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      link: [
        {
          name: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
      file: [
        {
          name: {
            type: String,
          },
          url: {
            type: String,
          },
        },
      ],
      tags: [
        {
          type: String,
        },
      ],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", GroupSchema);
