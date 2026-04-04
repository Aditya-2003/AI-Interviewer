const InterviewSession = require("../models/InterviewSession");
const User = require("../models/User");
const { generateFirstQuestion } = require("../services/generateFirstQuestion");
const { generateNextQuestion } = require("../services/generateNextQuestion");
const { generateInterviewFeedback } = require("../services/generateInterviewFeedback")
const { decrypt } = require("../utils/encryption");

const startInterview = async (req, res) => {
  try {
    const { role, experience } = req.body;

    const apiKey = decrypt(req.user.apiKeyEncrypted);

    if (!apiKey || apiKey === "") {
      return res.status(400).json({ error: "API key not configured. Please set your API key in the dashboard." });
    }

    const resumeText = req.user.resumeText;

    let firstQuestion;
    try {
      firstQuestion = await generateFirstQuestion(role, experience, resumeText, apiKey);
      // console.log("Generated first question:", firstQuestion);
    } catch (err) {
      console.error("AI generation failed:", err);
      return res.status(502).json({ error: "AI provider error. Please verify your API key and try again.", details: err.message });
    }

    const session = await InterviewSession.create({
      userId: req.user.id,
      role,
      experience,
      resumeText: resumeText || "",
      conversation: [
        {
          role: "ai",
          content: firstQuestion
        }
      ]
    });

    res.json({
      sessionId: session._id
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to start interview" });
  }
};

const MAX_AI_QUESTIONS = 6;

const sendMessage = async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    const session = await InterviewSession.findById(sessionId);

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // security check
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Check if Session Ended
    if (session.status === "completed") {
      // Ensure feedback is an object (parse if it's a string)
      let feedback = session.feedback;
      if (feedback && typeof feedback === 'string') {
        try {
          feedback = JSON.parse(feedback);
        } catch (err) {
          console.error("Failed to parse feedback:", err);
          feedback = null;
        }
      }
      
      return res.status(400).json({
        interviewCompleted: true,
        feedback: feedback
      });
    }

    // save user answer
    session.conversation.push({
      role: "user",
      content: message
    });

    // count AI questions
    const aiQuestionCount = session.conversation.filter(
      msg => msg.role === "ai"
    ).length;

    let aiReply;
    
    const apiKey = decrypt(req.user.apiKeyEncrypted);

    if (aiQuestionCount >= MAX_AI_QUESTIONS) {
      const feedback = await generateInterviewFeedback(
        session.role,
        session.experience,
        session.resumeText,
        session.conversation,
        apiKey
      );

      session.feedback = feedback;
      session.status = "completed";

      await session.save();

      return res.json({
        interviewCompleted: true,
        status: "completed",
        feedback: feedback
      });

    } else {

      aiReply = await generateNextQuestion(
        session.role,
        session.experience,
        session.resumeText,
        session.conversation,
        aiQuestionCount,
        apiKey
      );
    }

    session.conversation.push({
      role: "ai",
      content: aiReply
    });

    await session.save();

    res.json({
      reply: aiReply,
      status: session.status
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Message processing failed" });
  }
};

const getInterviewSession = async (req, res) => {
  try {
    const session = await InterviewSession.findById(req.params.sessionId);

    // Ensure if Session exists
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // security check - ensure session belongs to user
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // Ensure feedback is an object (parse if it's a string)
    let feedback = session.feedback;
    if (feedback && typeof feedback === 'string') {
      try {
        feedback = JSON.parse(feedback);
      } catch (err) {
        console.error("Failed to parse feedback:", err);
        feedback = null;
      }
    }

    res.json({
      role: session.role,
      experienceLevel: session.experience,
      status: session.status,
      conversation: session.conversation,
      feedback: feedback
    });

  } catch (err) {
    console.error("Error in getInterviewSession:", err);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};

module.exports = { startInterview, sendMessage, getInterviewSession };