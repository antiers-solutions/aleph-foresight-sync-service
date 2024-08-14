module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testRegex: '.spec.ts$',
  moduleFileExtensions: ['js', 'json', 'ts'],
  coverageDirectory: './coverage',
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 95,
      lines: 95,
      statements: 95,
    },
  },
  testPathIgnorePatterns: ['/node_modules/'], 
  coveragePathIgnorePatterns: [
        "<rootDir>/src/server.ts",
        "<rootDir>/src/worker/index.ts",
        "<rootDir>/src/models/index.ts",
        "<rootDir>/src/responses/index.ts",
        "<rootDir>/src/mongoDB/connection.ts",
        "<rootDir>/src/models/Transaction/index.ts",
        "<rootDir>/src/repanda",

    ],
  setupFilesAfterEnv: ['<rootDir>/src/test/helper/testSetup.ts'],
}