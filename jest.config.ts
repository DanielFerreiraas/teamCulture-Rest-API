module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/tests/setupTest.ts"],
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  coverageReporters: ["json", "text", "lcov", "clover"],
  testMatch: ["**/**/*.unit.ts", "**/**/*.test.ts"],
  verbose: true,
};
