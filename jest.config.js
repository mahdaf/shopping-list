export default {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/vite-env.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  reporters: [
    "default",
    ["jest-stare", {
      "resultDir": "results/jest-stare",
      "reportTitle": "Shopping List Test Report",
      "coverageLink": "../coverage/lcov-report/index.html",
      "jestStareConfigJson": "jest-stare.json",
      "jestGlobalConfigJson": "jest.config.json",
      "reportHeadline": "Shopping List Test Results",
      "reportSummary": true
    }]
  ]
}; 