// 456
// // // Foo

exports.activate = function() {}

exports.deactivate = function() {}

// // // Commands

nova.commands.register("document-sections.go-to-section", (editor) => {
  const doc = editor.document;
  const sections = findSections(doc);

  if (!sections || sections.length == 0) {
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
      goToLine(editor, sections[index])
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
    const pattern = /\n\s*(\/\/ \/\/ \/\/|# # #)(.*)\n/g

    // const pattern = combineRegexes(["// // //", "# # #"])

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

function combineRegexes(regexList) {
  const combinedRegexPattern = regexList.map(r => `(?:${r})`).join('|');
  return new RegExp(`\n\s*${combinedRegexPattern}(.*)\n`, 'g');
}

function trim(text) {
  if (text) {
    return text.trim();
  } else {
    return null;
  }
}

function calculateLine(text, pos) {
  let fragment = text.substring(0, pos);
  let line = (fragment.match(/\n/g) || []).length + 1;
  return line;
}

function goToLine(editor, section) {
  if (section) {
    editor.selectedRange = new Range(section.end - 1, section.end - 1)
    editor.scrollToCursorPosition()
  }
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
