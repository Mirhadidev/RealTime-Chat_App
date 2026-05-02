import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./lib/db.js";
import cookieParser from "cookie-parser";
import { app, server } from "./lib/socket.js";
import path from "path";

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Determine the correct path to frontend dist folder
// On Render, the app runs from the root directory where package.json is located
const rootDir = path.resolve(__dirname, "..");
const frontendPath = path.join(rootDir, "frontend", "dist");

// Always serve static files in production (or check for dist folder existence)
const distFolderExists = require("fs").existsSync(frontendPath);

if (distFolderExists) {
  app.use(express.static(frontendPath));

  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log("server running on", PORT);
  });
});
