const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const User = require("./models/User");
const InterviewSession = require("./models/InterviewSession");

const app = express();
app.use(cors());
app.use(express.json());

const { register } = require("./controllers/register");
const { login } = require("./controllers/login");

const { getResume, setResume } = require("./controllers/resume");
const { startInterview, sendMessage , getInterviewSession } = require("./controllers/interview");
const upload = require("./middleware/resumeUpload");

const { getApiKey, setApiKey } = require("./controllers/apiKeys");

const { isAuthorized } = require("./middleware/middleware");

const PORT = process.env.PORT || 8080;
const dbUrl = process.env.DB_URL;

async function main() {
  await mongoose.connect(dbUrl);
}

main().then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

app.get("/", (req, res) => {
  res.send("Welcome to the AI Interviewer API");
});

// --- User Authentication Routes ---

app.post("/api/users/register", register);
app.post("/api/users/login", login);

// --- User Profile Route ---

app.get("/api/users/me", isAuthorized, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// --- API Key Management ---

app.post("/api/users/api-key", isAuthorized, setApiKey);

app.get("/api/users/api-key", isAuthorized, getApiKey);

// --- Resume Management Routes ---

app.get("/api/resume", isAuthorized, getResume);

app.post("/api/resume/upload",
  isAuthorized,
  upload.single("resume"),
  setResume
);

// --- Interview Session Routes ---
app.post("/api/interview/start", isAuthorized, startInterview);

app.post("/api/interview/message", isAuthorized, sendMessage);

app.get("/api/interview/:sessionId", isAuthorized, getInterviewSession);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});