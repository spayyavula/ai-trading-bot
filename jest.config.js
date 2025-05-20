module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/apps/shared/test-utils/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/apps/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/apps/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/apps/**/*.{spec,test}.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'apps/**/*.{ts,tsx}',
    '!apps/**/*.d.ts',
    '!apps/**/index.{ts,tsx}',
    '!apps/**/types.{ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
}; 