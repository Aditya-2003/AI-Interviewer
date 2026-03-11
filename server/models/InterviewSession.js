const mongoose = require('mongoose');

// --- Interview Message Schema --- 
const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ["ai", "user"],
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { _id: false }); 

// --- Interview Session Schema -- 
const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  role: {
    type: String,
    required: true
  },

  experience: {
    type: String,
    required: true
  },

  resumeText: {
    type: String
  },

  conversation: [messageSchema],

  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active"
  },

  feedback: {
    type: String,
  }

}, { timestamps: true });

const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);
module.exports = InterviewSession;