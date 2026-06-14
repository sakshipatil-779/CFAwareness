import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      lines: 80,
      functions: 80,
      branches: 70,
      statements: 80,
    },
  },
}

export default config
