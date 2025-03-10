import { createPathMatcher } from "../src/core/common";

describe("createPathMatcher", () => {
  test.each([
    [["a", "b"], true],
    [["a", "b", "c"], true],
    [["a", "b", "c", "d"], true],
    [["a"], false],
    [["b", "c"], false],
    [["b", "a"], false],
    [["a", "c"], false],
  ])("[a, b] -> [a,b,...]", (param, expected) => {
    const matcher = createPathMatcher(["a", "b"]);
    expect(matcher(param)).toBe(expected);
  });
  test.each([
    [["计算机科学", "计算机网络"], true],
    [["计算机科学", "数据结构"], true],
    [["数据结构"], false],
    [["计算机类", "计算机科学"], false],
    [["计算机类", "计算机科学", "计算机网络"], false],
  ])("[中文1, 中文2] -> [中文1, 中文2, ...]", (param, expected) => {
    const matcher = createPathMatcher(["计算机科学"]);
    expect(matcher(param)).toBe(expected);
  });
});
