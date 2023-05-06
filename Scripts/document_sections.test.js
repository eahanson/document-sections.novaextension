const {
  buildRegex,
  calculateLine,
  findNextValue,
  findPreviousValue,
  isNonEmptyString,
  trim
} = require("./document_sections");

describe("buildRegex", () => {
  test("builds a regex from one pattern", () => {
    expect(buildRegex(["// // //"])).toEqual(/\n\s*(\/\/ \/\/ \/\/)(.*)\n/g)
  })

  test("builds a regex from multiple patterns", () => {
    expect(buildRegex(["// // //", "# # #"])).toEqual(/\n\s*(\/\/ \/\/ \/\/|# # #)(.*)\n/g)
  })

  test("uses a default pattern if none is given", () => {
    const defaultPattern = /\n\s*(\/\/ \/\/ \/\/|# # #)(.*)\n/g

    expect(buildRegex()).toEqual(defaultPattern)
    expect(buildRegex(null)).toEqual(defaultPattern)
    expect(buildRegex([])).toEqual(defaultPattern)
  })
})

describe("calculateLine", () => {
  test("returns the 1-based line number of the given character position", () => {
    const s = "ab\ncd\nef\n"

    expect(calculateLine(s, 0)).toEqual(1) // a
    expect(calculateLine(s, 1)).toEqual(1) // b
    expect(calculateLine(s, 2)).toEqual(1) // newline
    expect(calculateLine(s, 3)).toEqual(2) // c
    expect(calculateLine(s, 4)).toEqual(2) // d
    expect(calculateLine(s, 5)).toEqual(2) // newline
    expect(calculateLine(s, 6)).toEqual(3) // e
    expect(calculateLine(s, 7)).toEqual(3) // f
    expect(calculateLine(s, 8)).toEqual(3) // newline
    expect(calculateLine(s, 9)).toEqual(4) // beyond the end of the string
    expect(calculateLine(s, 1000)).toEqual(4) // way beyond the end of the string
  })
})

describe("findNextValue", () => {
  test("finds the value in the sorted array that is greater than the given value", () => {
    expect(findNextValue([10, 20, 30], 15)).toEqual(20)
    expect(findNextValue([10, 20, 30], 10)).toEqual(20)
  })

  test("returns the given value if there is no greater number", () => {
    expect(findNextValue([10, 20, 30], 35)).toEqual(35)
    expect(findNextValue([10, 20, 30], 30)).toEqual(30)
    expect(findNextValue([], 10)).toEqual(10)
  })
})

describe("findPreviousValue", () => {
  test("finds the value in the sorted array that is less than the given value", () => {
    expect(findPreviousValue([10, 20, 30], 25)).toEqual(20)
    expect(findPreviousValue([10, 20, 30], 30)).toEqual(20)
  })

  test("returns 1 if there is no smaller number", () => {
    expect(findPreviousValue([10, 20, 30], 5)).toEqual(1)
    expect(findPreviousValue([10, 20, 30], 10)).toEqual(1)
    expect(findPreviousValue([], 10)).toEqual(1)
  })
})

describe("isNonEmptyString", () => {
  test("returns true when given a string that is not empty", () => {
    expect(isNonEmptyString("foo bar")).toEqual(true)
  })

  test("returns false when given something that's not a string", () => {
    expect(isNonEmptyString(4)).toEqual(false)
  })

  test("returns false when given an empty string", () => {
    expect(isNonEmptyString("")).toEqual(false)
    expect(isNonEmptyString(" \n  \t ")).toEqual(false)
  })
})

describe("trim", () => {
  test("trims leading and trailing spaces", () => {
    expect(trim("  foo \n \t  ")).toEqual("foo")
  })

  test("returns an empty string when string is null", () => {
    expect(trim(null)).toEqual("")
  })
})
