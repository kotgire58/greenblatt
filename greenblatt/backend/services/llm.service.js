const axios = require("axios")

const analyzeWithLLM = async (analysisData) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        max_tokens: 500,
        temperature: 0.4,
        messages: [
          {
            role: "system",
            content: `
You are a disciplined long-term value investing analyst 
in the style of Warren Buffett.

Rules:
- Do NOT invent numbers.
- Only use the provided metrics.
- If a metric is null, acknowledge uncertainty.
- Provide strengths, risks, and valuation insight.
- Be concise but professional.
You are a quantitative financial analyst.

STRICT RULES:
- Use ONLY the numerical data provided.
- Do NOT mention industry, product, competitive position, or business description.
- Do NOT infer information not explicitly in the metrics.
- Do NOT assign ratings (e.g., 6/10).
- If a metric is null, state: "Data unavailable."
- Base all reasoning strictly on the numbers shown.
`
          },
          {
            role: "user",
            content: `
Analyze this company using the provided structured metrics:

${JSON.stringify(analysisData, null, 2)}

Structure your response as:

1. Business Quality
2. Financial Strength
3. Valuation
4. Overall Assessment
`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    )

    return response.data.choices[0].message.content
  } catch (err) {
    console.error("LLM Error:", err.response?.data || err.message)
    return "LLM analysis unavailable at the moment."
  }
}

module.exports = analyzeWithLLM