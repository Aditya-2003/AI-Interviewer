const axios = require("axios")

async function generateFirstQuestion(role, experience, resumeText, apiKey) {
    const prompt = `
ROLE:
You are a senior interviewer conducting a professional interview.

CONTEXT:
You are interviewing a candidate who has applied for the following role:

JOB ROLE: ${role}
EXPERIENCE LEVEL: ${experience}

INTERVIEW TYPE DETECTION:
Determine the nature of the interview based on the JOB ROLE provided.

Possible interview styles include but are not limited to:

• Technical interview (engineering, data science, etc.)
• Product or strategy interview
• Design interview
• Marketing interview
• Sales interview
• Business / management interview
• Behavioral interview

Adapt your questions to match the role.

You also have access to the candidate's resume.

Candidate Resume:
${resumeText.slice(0, 2000)}

TASK:
Start the interview in a natural and professional way.

1. Give a short greeting.
2. Ask the candidate to introduce themselves.
3. Optionally reference ONE thing from the resume inside the same question.

The message must contain only ONE question.

CONSTRAINTS:
- The entire response must be 2 to 3 sentences maximum.
- Ask only ONE question.
- Do not ask follow-up questions.
- Do not praise the resume.
- Do not explain the interview process.
- Do not generate multiple questions.
- The message should sound like a real interviewer starting an interview.


GREETING + Candidate introduction and background.

OUTPUT FORMAT:
Return ONLY the interviewer's message exactly as it would be spoken to the candidate.

EXAMPLES OF GOOD OUTPUT:
Example 1:
Hi, thanks for joining today. Could you briefly introduce yourself and walk me through your experience with React and frontend development?
Example 2:
Hello, it's great to meet you. I noticed you worked on a room rental platform — could you introduce yourself and explain your role in that project?
Example 3
Hi, thanks for being here. Could you start by introducing yourself and telling me about your background in web development?
`
    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                model: "llama-3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are a technical interviewer." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.2,
                max_tokens: 200
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                }
            }
        )

        const question = response?.data?.choices?.[0]?.message?.content
        console.log("AI response:", question)

        if (!question) {
            throw new Error("AI returned empty response")
        }

        return question.trim()

    } catch (err) {
        console.error("AI generation failed:", err?.response?.data || err.message)
        throw new Error("Failed to generate interview question")
    }
}

module.exports = { generateFirstQuestion }