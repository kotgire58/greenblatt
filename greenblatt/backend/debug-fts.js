// Run this from your backend folder: node debug-fts.js
// It will print the exact field names returned by fundamentalsTimeSeries

const YahooFinance = require("yahoo-finance2").default
const yahooFinance = new YahooFinance({ suppressNotices: ["yahooSurvey"] })

async function main() {
  // Read the module source to find valid options
  const fs = require("fs")
  const path = require("path")
  
  const modulePath = path.join(__dirname, "node_modules/yahoo-finance2/script/src/modules/fundamentalsTimeSeries.js")
  if (fs.existsSync(modulePath)) {
    const src = fs.readFileSync(modulePath, "utf8")
    // Print lines that mention "type" or valid enum values
    const lines = src.split("\n")
    lines.forEach((line, i) => {
      if (line.includes("annual") || line.includes("quarterly") || line.includes("enum") || line.includes("period")) {
        console.log(`Line ${i}: ${line.trim()}`)
      }
    })
  }

  console.log("\n--- Now trying actual API call ---\n")
  try {
    // Try with just period1 as a Date object, no type
    const result = await yahooFinance.fundamentalsTimeSeries("AAPL", {
      period1: new Date("2023-01-01"),
      period2: new Date(),
    })
    console.log("SUCCESS! Keys returned:", Object.keys(result))
    console.log("Sample data:", JSON.stringify(result, null, 2).slice(0, 2000))
  } catch (e) {
    console.error("ERROR:", e.message)
    
    // Try alternate form
    try {
      console.log("\nTrying with no options...")
      const result2 = await yahooFinance.fundamentalsTimeSeries("AAPL")
      console.log("SUCCESS! Keys returned:", Object.keys(result2))
    } catch (e2) {
      console.error("ERROR 2:", e2.message)
    }
  }
}

main()