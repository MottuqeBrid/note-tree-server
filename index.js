// server.js (polished version)

const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
// const helmet = require("helmet"); // ✅ enable later for security

const app = express();
const PORT = process.env.PORT || 5000;

/* =====================
   Middleware
===================== */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(helmet()); // ✅ optional security layer

// 🔐 CORS setup (Configurable)
const allowedOrigins = [
  "http://localhost:3000",
  "https://note-tree-flame.vercel.app", // ✅ frontend deployed origin
];
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
// ✅ Preflight requests
app.options("*", cors());

/* =====================
   Environment Checks
===================== */
if (!process.env.MONGODB_URI) {
  console.error("❌ ERROR: MONGODB_URI is missing in .env file");
  process.exit(1);
}

/* =====================
   Database Connection
===================== */
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

/* =====================
   Routes
===================== */
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Note Tree API 🚀" });
});

app.use("/api/auth", require("./router/AuthRouter"));
app.use("/api/notes", require("./router/noteRouter"));
app.use("/api/upload", require("./router/upload"));

/* =====================
   Error Handling
===================== */
// 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message || err);
  res.status(500).json({ error: "Internal Server Error" });
});

/* =====================
   Server Start
===================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
