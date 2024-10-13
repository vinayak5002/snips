const express = require("express");
const cors = require("cors");
const path = require("path");
const { ensureDirectoryExists } = require("./utils/utils");
const app = express();
const port = 5000;

// Basic CORS configuration
app.use(cors());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

// Import the routes
const snipsRouter = require("./routes/snipRoutes");

const loggerMiddleware = (req, res, next) => {
  console.log(req.method, req.url);
  next(); // Proceed to the next middleware or route handler
};

// API routes
app.use("/api", loggerMiddleware, snipsRouter);

// Serve index.html for all unknown routes (SPA fallback)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

function init() {
  const dir1 = path.join(__dirname, "documents");
  const dir2 = path.join(__dirname, "idfs");

  ensureDirectoryExists(dir1);
  ensureDirectoryExists(dir2);
}

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  init();
});
