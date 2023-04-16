// Main file. This comment shouldn't be counted as a section.

const { buildRegex, calculateLine, isNonEmptyString, trim } = require("./document_sections")

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
      goToLine(editor, sections[index])
    )
  }
});

nova.commands.register("document-sections.go-to-previous-section", (editor) => {
});

nova.commands.register("document-sections.go-to-next-section", (editor) => {
  // const doc = editor.document;
  // const sections = findSections(doc);
  // console.log("selectedRange", editor.getLineRangeForRange(editor.selectedRange));
});

// // //

function findSections(doc) {
  const text = doc.getTextInRange(new Range(0, doc.length))

  if (isNonEmptyString(text)) {
    const pattern = buildRegex()

    let sections = []
    while(result = pattern.exec(text)) {
      let start = pattern.lastIndex - result[0].length;
      let end = pattern.lastIndex;
      let name = trim(result[2]);
      let line = calculateLine(text, start + 1);
      sections.push({start: start, end: end, name: name, line: line});
    };

    return sections;
  } else {
    return [];
  }
}

function goToLine(editor, section) {
  if (section) {
    editor.selectedRange = new Range(section.end - 1, section.end - 1)
    editor.scrollToCursorPosition()
  }
}

