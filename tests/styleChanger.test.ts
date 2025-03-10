import { describe, test, expect, beforeEach } from "@jest/globals";

describe("1", () => {
  beforeEach(() => {
    document.body.innerHTML = "color: red;";
  });

  test("1", () => {
    expect(document.body.innerHTML).toContain("color: red;");
  });
});
