module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "@talia/(.*)": "<rootDir>/src/$1"
  },
};
