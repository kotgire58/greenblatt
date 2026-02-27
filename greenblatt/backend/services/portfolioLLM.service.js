const axios = require("axios")

exports.extractHoldingsFromText = async (text) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-3-8b-instruct",
        temperature: 0,
        messages: [
          {
            role: "system",
            content:
              "You are a strict JSON extractor. Return ONLY a valid JSON array. No explanations."
          },
          {
            role: "user",
            content: `
Extract stock holdings from the OCR text below.

Return STRICT JSON in this format:

[
  {
    "ticker": "AAPL",
    "shares": 10
  }
]

Rules:
- Ignore cost basis
- Ignore price
- Ignore daily gain/loss
- Ignore percentages
- Only extract ticker symbols and number of shares
- If shares unclear, skip that row
- Do NOT include any text before or after JSON

OCR TEXT:
${text}
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

    let content = response.data.choices[0].message.content

    console.log("LLM RAW RESPONSE:\n", content)

    content = content.replace(/```json|```/g, "").trim()

    const jsonMatch = content.match(/\[.*\]/s)

    if (!jsonMatch) {
      throw new Error("No valid JSON array found")
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (!Array.isArray(parsed)) {
      throw new Error("Parsed response is not array")
    }

    return parsed.map(item => ({
      ticker: item.ticker?.toUpperCase(),
      shares: Number(item.shares)
    }))

  } catch (error) {
    console.error("LLM Extraction Error:", error.message)
    throw new Error("Failed to extract holdings")
  }
}