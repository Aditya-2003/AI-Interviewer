const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

const isAuthorized = async(req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // fetch user from DB
    const user = await User.findById(decoded.id).select("apiKey resumeText");

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      id: decoded.id,
      apiKeyEncrypted: user.apiKey,
      resumeText: user.resumeText
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { isAuthorized };