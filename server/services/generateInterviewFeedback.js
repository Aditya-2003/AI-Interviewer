const axios = require("axios");

async function generateInterviewFeedback(
  role,
  experienceLevel,
  resumeText,
  conversation,
  apiKey
) {

  const conversationText = conversation
    .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
    .join("\n");

  const prompt = ` ROLE:
You are a senior software engineering interviewer evaluating a candidate after a technical interview.

CONTEXT:
Role: ${role}
Experience Level: ${experienceLevel}

Candidate Resume:
${resumeText.slice(0, 2000)}

Interview Conversation:
${conversationText}

TASK:
Evaluate the candidate strictly based on the interview conversation.

IMPORTANT RULES:

* ONLY use evidence from the conversation.
* DO NOT assume anything not said.
* DO NOT hallucinate strengths or weaknesses.
* If evidence is missing, explicitly state it.
* Keep evaluation objective and specific.
* Avoid generic statements.

EVALUATION CRITERIA:

1. Technical Knowledge
   Evaluate understanding of technologies, tools, and concepts relevant to the role.

2. Problem Solving Ability
   Evaluate how the candidate approached problems, reasoning, and decision-making.

3. Communication Clarity
   Evaluate clarity, structure, and ability to explain ideas.

4. Strengths
   List only strengths demonstrated in the conversation. Each must be evidence-based.

5. Weaknesses
   List weaknesses ONLY if clearly supported by the conversation.
   If no clear weaknesses exist, return an empty array.

6. Suggestions
   Provide practical, actionable improvements based on weaknesses.

7. Recommendation
   Choose ONE:

* Strong Hire
* Hire
* Borderline
* No Hire

Must include reasoning based on evidence.

OUTPUT FORMAT (STRICT JSON ONLY — NO TEXT OUTSIDE JSON):

{
"technical": {
"score": number (0-10),
"explanation": "string"
},
"problemSolving": {
"score": number (0-10),
"explanation": "string"
},
"communication": {
"score": number (0-10),
"explanation": "string"
},
"strengths": [
"string",
"string"
],
"weaknesses": [
"string",
"string"
],
"suggestions": [
"string",
"string"
],
"recommendation": {
"decision": "Strong Hire | Hire | Borderline | No Hire",
"reason": "string"
}
}

CRITICAL:

* Return ONLY valid JSON.
* Do NOT wrap in markdown.
* Do NOT add explanations outside JSON.
* Ensure JSON is parsable by JavaScript (JSON.parse).
`;

  try {

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "system",
            content: "You are a senior engineering interviewer evaluating candidates."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 800
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        }
      }
    );

    const feedback = response?.data?.choices?.[0]?.message?.content;

    if (!feedback) {
      throw new Error("AI returned empty feedback");
    }

    try {
      return JSON.parse(feedback.trim());
    } catch (err) {
      console.error("Invalid JSON from AI:", feedback);
      throw new Error("AI returned invalid JSON");
    }

  } catch (err) {
    console.error("AI feedback generation failed:", err?.response?.data || err.message);
    throw new Error("Failed to generate interview feedback");
  }
}

module.exports = { generateInterviewFeedback };