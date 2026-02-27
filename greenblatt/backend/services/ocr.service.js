const Tesseract = require("tesseract.js")

exports.extractTextFromImage = async (imagePath) => {
  const { data: { text } } = await Tesseract.recognize(
    imagePath,
    "eng"
  )

  return text
}