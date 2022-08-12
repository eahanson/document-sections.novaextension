exports.activate = function() {}

exports.deactivate = function() {}

// // // Commands

nova.commands.register("document-sections.go-to-section", (editor) => {
  const doc = editor.document;
  const sections = findSections(doc);

  if (sections.length == 0) {
    return;
  } else {
    const names = sections.map((section) => {
      if (section.name) {
        return `${section.name} (line ${section.line})`
      } else {
        return `Line ${section.line}`
      }
    });
    
    nova.workspace.showChoicePalette(names, {}, (name, index) =>
      goToLine(doc, sections[index])
    );
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
  const text = doc.getTextInRange(new Range(0, doc.length));

  if (isNonEmptyString(text)) {
    return text
      .split("\n")
      .reduce((acc, text, index) => {
        if (text.startsWith("// // //")) {
          acc.push({ name: sectionName(text), line: index + 1 })
        }
        return acc;
      }, [])
  } else {
    return [];
  }
}

function goToLine(doc, section) {
  nova.workspace.openFile(doc.uri, { line: section.line });
}

function isNonEmptyString(s) {
  return s && typeof s == "string" && !/^\s*$/.test(s);
}

function sectionName(s) {
  const name = s.replace("// // //", "").trim();
  if (name.length > 0) {
    return name;
  } else {
    return null;
  }
}
