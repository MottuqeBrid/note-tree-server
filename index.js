const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

// middleware
// app.use(cookieParser());
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://note-tree-flame.vercel.app"],
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "http://localhost:3000",
  "https://note-tree-flame.vercel.app",
  "https://note-tree-server.vercel.app",
];
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

//   routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/api/auth", require("./router/AuthRouter"));
app.use("/api/notes", require("./router/noteRouter"));
app.use("/api/upload", require("./router/upload"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
