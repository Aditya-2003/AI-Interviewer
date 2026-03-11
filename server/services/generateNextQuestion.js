const axios = require("axios")

async function generateNextQuestion(
  role,
  experienceLevel,
  resumeText,
  conversation,
  aiQuestionCount,
  apiKey
) {

  const conversationText = conversation
    .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n")

  const prompt = `
ROLE:
You are a senior Technical Interviewer conducting a live interview.

CONTEXT:
You are interviewing a candidate for following role.

JOB ROLE: ${role}
EXPERIENCE LEVEL: ${experienceLevel}

You also have access to the candidate's resume.

Candidate Resume:
${resumeText.slice(0, 2000)}

Below is the interview conversation so far.

INTERVIEW CONVERSATION:
${conversationText}

Use the candidate's resume to determine relevant topics.
Prioritize technologies, projects, tools, and systems mentioned in the resume.

CURRENT QUESTION NUMBER: ${aiQuestionCount + 1}

TASK:
Ask ONE interview question.

Use the following to determine the question:
• CURRENT QUESTION NUMBER
• INTERVIEW FLOW rules
• Candidate resume
• Conversation history

Follow the correct interview phase based on the question number and move the interview forward naturally.
If the candidate’s answer is vague, incomplete, or incorrect, ask a probing follow-up question before moving to the next topic.


INTERVIEW FLOW:

Question 2 → Deep dive into a project from the resume  
Ask the candidate to explain architecture, design decisions, and trade-offs.

Question 3 → Technical concept related to technologies mentioned in the resume  
Examples: React, Node.js, APIs, databases, authentication, performance optimization.

Question 4 → Scenario-based engineering problem  
Example: system design, debugging situation, scalability challenge.

Question 5 → Behavioral engineering question  
Examples:
- Tell me about a difficult bug you encountered and how you solved it.
- Describe a challenging technical problem you faced in a project.
- How do you handle tight deadlines during development?

Question 6 → Advanced engineering or decision-making question  
Focus on trade-offs, architecture decisions, or performance optimization.

LANGUAGE VARIETY RULES:
Use natural interviewer phrasing and vary question openings.

Avoid repeatedly starting questions with phrases like:
"You mentioned..."
"You explained..."
"You walked me through..."

Use varied natural openings such as:

• "Let’s dive deeper into..."
• "Imagine the system suddenly receives..."
• "How would you approach..."
• "What trade-offs would you consider..."
• "Walk me through how you would handle..."

CONSTRAINTS:
• Ask exactly ONE interview question (1–3 sentences).
• Maintain a professional interviewer tone.
• Do not repeat previous questions.
• Do not praise the candidate or restate their answer unnecessarily.
• Do not explain the interview process or mention question numbers.
• Do not end the interview or generate feedback.

Ask the question naturally as a human interviewer would.

OUTPUT FORMAT:
Return only the interviewer’s question exactly as it would be spoken in an interview.

EXAMPLES OF GOOD OUTPUT:

Example 1:
That's interesting. How would your approach change if the dataset became extremely large?

Example 2:
How would you design an API that needs to handle thousands of concurrent requests?

Example 3:
Suppose your React application is experiencing frequent re-renders. How would you diagnose and optimize the problem?

Example 4:
Tell me about a challenging bug you encountered in one of your projects and how you solved it.
`

  try {

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a professional technical interviewer."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 200
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    )

    const nextQuestion = response?.data?.choices?.[0]?.message?.content

    if (!nextQuestion) {
      throw new Error("AI returned empty response")
    }

    return nextQuestion.trim()

  } catch (err) {
    console.error("AI generation failed:", err?.response?.data || err.message)
    throw new Error("Failed to generate next interview question")
  }
}

module.exports = { generateNextQuestion }