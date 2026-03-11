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

  const prompt = `ROLE:
You are a senior software engineering interviewer responsible for evaluating a candidate after a technical interview.

CONTEXT:
The candidate applied for the following role.

Role: ${role}
Experience Level: ${experienceLevel}

You also have access to the candidate's resume and the full interview conversation.

Candidate Resume:
${resumeText.slice(0,2000)}

Interview Conversation:
${conversationText}

TASK:
Evaluate the candidate's performance based ONLY on the interview conversation above.

Your evaluation must be evidence-based.
Only make statements that are supported by something the candidate said in the conversation.

Do NOT assume weaknesses or strengths that were not demonstrated in the interview.

If you mention a strength or weakness, reference the part of the interview that supports your statement.

If there is insufficient evidence for a weakness, explicitly say:
"No clear weakness observed in the interview conversation."

EVALUATION AREAS:

1. Technical Knowledge (Score out of 10)
Evaluate the candidate’s understanding of technologies, tools, and technical concepts relevant to the role.

2. Problem Solving Ability (Score out of 10)
Evaluate how the candidate approached problems, handled scenarios, considered trade-offs, and reasoned about solutions.

3. Communication Clarity (Score out of 10)
Evaluate how clearly the candidate explained ideas, structured answers, and communicated technical concepts.

4. Strengths
List strengths demonstrated in the interview.
Each strength must reference something the candidate said or explained.

5. Weaknesses
List weaknesses ONLY if they are clearly supported by the interview conversation.
If weaknesses are mentioned, briefly reference the part of the conversation that demonstrates the issue.

If no clear weaknesses are observed, state:
"No clear weaknesses were demonstrated during the interview."

6. Suggestions for Improvement
Provide realistic and practical suggestions for improvement based on the weaknesses observed.

7. Hiring Recommendation
Choose ONE:

- Strong Hire
- Hire
- Borderline
- No Hire

Your recommendation must be justified using evidence from the interview conversation.

CONSTRAINTS:
- Base the evaluation strictly on the interview conversation.
- Do not hallucinate missing details.
- Do not invent weaknesses or strengths.
- Reference candidate answers when making claims.
- Keep the evaluation objective and professional.
- Avoid generic statements.

OUTPUT FORMAT:

Technical Knowledge: X/10
Explanation: ...

Problem Solving Ability: X/10
Explanation: ...

Communication Clarity: X/10
Explanation: ...

Strengths:
- ...
- ...

Weaknesses:
- ...
- ...
OR
No clear weaknesses were demonstrated during the interview.

Suggestions for Improvement:
- ...
- ...

Final Recommendation:
...
Reasoning: ...`;

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

    return feedback.trim();

  } catch (err) {
    console.error("AI feedback generation failed:", err?.response?.data || err.message);
    throw new Error("Failed to generate interview feedback");
  }
}

module.exports = { generateInterviewFeedback };