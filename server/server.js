require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const dbConfig = require("./config/db");
const initializeSocket = require("./sockets/chatSocket");
const errorMiddleware = require("./middlewares/errorMiddleware");
const ApiError = require("./util/ApiError");

const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/EventsRoutes");
const adminRoutes = require("./routes/AdminRoutes");

const app = express();

// Security Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or server-to-server)
      if (!origin || allowedOrigins.includes(origin) || origin.includes("localhost")) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev, configurable for prod
    },
    credentials: true,
  })
);

// Logging & Body Parsers
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(express.json({ limit: "20mb" }));
app.use(express.static(path.join(__dirname, "public/assets")));

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Application Routes
app.use("/api/user", userRoutes);
app.use("/api/event", eventRoutes);
app.use("/api/admin", adminRoutes);

// Catch-all for undefined routes
app.use((req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
});

// Centralized Error Handling Middleware
app.use(errorMiddleware);

const port = process.env.PORT || 5000;
const server = app.listen(port, () => {
  console.log(`[EventSphere Server] running on port ${port}`);
});

initializeSocket(server);

module.exports = app;
