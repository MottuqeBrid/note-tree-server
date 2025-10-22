const express = require("express");
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// middleware

app.use(cookieParser());

app.set("trust proxy", 1); // <--- important for proxies
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://note-tree-flame.vercel.app",
//       "https://note-tree-server.vercel.app",
//       "https://notetree.toytree.top",
//       "https://one.toytree.top",
//     ],
//     credentials: true,
//   })
// );

const allowedOrigins = [
  "http://localhost:3000",
  "https://note-tree-flame.vercel.app",
  "https://note-tree-server.vercel.app",
  "https://notetree.toytree.top",
  "https://one.toytree.top",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

// routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/api/auth", require("./router/AuthRouter"));
app.use("/api/notes", require("./router/noteRouter"));
app.use("/api/upload", require("./router/upload"));
app.use("/api/users", require("./router/UserRouter"));
app.use("/api/covers", require("./router/CoverRouter"));
app.use("/api/images", require("./router/imageRouter"));
app.use("/api/groups", require("./router/GroupRouter"));
app.use("/api/others", require("./router/OtherRouter"));

// Start server only after database connection
const startServer = async () => {
  try {
    // Wait for mongoose connection to be ready
    if (mongoose.connection.readyState !== 1) {
      await new Promise((resolve) => {
        mongoose.connection.on("connected", resolve);
      });
    }

    app.listen(PORT, () => {
      console.log(`Server listening at http://localhost:${PORT}`);
      console.log(
        `Database connection state: ${mongoose.connection.readyState}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
