/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": ["ts-jest",{}],
  },
  testMatch: ["**/tests/**/*.test.ts"],
  roots: ["<rootDir>/tests"],
};