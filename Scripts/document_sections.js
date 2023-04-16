function calculateLine(text, pos) {
  let fragment = text.substring(0, pos)
  let line = (fragment.match(/\n/g) || []).length + 1
  return line
}

function buildRegex(maybePatterns) {
  const defaultPatterns = ["// // //", "# # #"]
  let patterns = (maybePatterns || [])
  patterns = patterns.length > 0 ? patterns : defaultPatterns

  return new RegExp(`\\n\\s*(${patterns.join('|')})(.*)\\n`, 'g')
}

function isNonEmptyString(s) {
  return (typeof s == "string") && trim(s).length > 0
}

function trim(s) {
  return s ? s.trim() : ""
}

module.exports = {
  buildRegex,
  calculateLine,
  isNonEmptyString,
  trim
}
