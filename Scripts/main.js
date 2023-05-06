// Main file. This comment shouldn't be counted as a section.

const {
  buildRegex,
  calculateLine,
  findNextValue,
  findPreviousValue,
  isNonEmptyString,
  trim
} = require("./document_sections")

// // // Unused Nova things

exports.activate = function() {}

exports.deactivate = function() {}

// // // Commands

nova.commands.register("document-sections.go-to-section", (editor) => {
  const sections = findSections(editor.document)

  if (!sections || sections.length == 0) {
    return
  } else {
    const names = sections.map((section) =>
      section.name ? `${section.name} (line ${section.line})` : `Line ${section.line}`
    )

    nova.workspace.showChoicePalette(names, {}, (name, index) =>
      goToSection(editor, sections[index])
    )
  }
})

nova.commands.register("document-sections.go-to-previous-section", (editor) => {
  const newPosition = findPreviousValue(findSectionEndPositions(editor.document), editor.selectedRange.start)
  goToPosition(editor, newPosition - 1)
})

nova.commands.register("document-sections.go-to-next-section", (editor) => {
  const newPosition = findNextValue(findSectionEndPositions(editor.document), editor.selectedRange.start)
  goToPosition(editor, newPosition - 1)
})

// // //

function currentLine(editor) {
  return calculateLine(documentText(editor.document), editor.selectedRange.start)
}

function documentText(document) {
  return document.getTextInRange(new Range(0, document.length))
}

function findSections(document) {
  const text = documentText(document)

  if (isNonEmptyString(text)) {
    const pattern = buildRegex()

    let sections = []
    while (result = pattern.exec(text)) {
      let start = pattern.lastIndex - result[0].length
      let end = pattern.lastIndex
      let name = trim(result[2])
      let line = calculateLine(text, start + 1) + 1
      sections.push({ start: start, end: end, name: name, line: line })
    }

    return sections
  } else {
    return []
  }
}

function findSectionEndPositions(document) {
  return findSections(document).map(section => section.end)
}

function goToPosition(editor, pos) {
  editor.selectedRange = new Range(pos, pos)
  editor.scrollToCursorPosition()
}

function goToSection(editor, section) {
  if (section) {
    goToPosition(editor, section.end - 1)
  }
}
