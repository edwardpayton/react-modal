module.exports = {
  coverageDirectory: '<rootDir>/test/__coverage__/',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/__mocks__/fileMock.js',
    '\\.(css|scss|less)$': '<rootDir>/test/__mocks__/styleMock.js',
  },
  setupFiles: ['<rootDir>/test/__mocks__/shim.js'],
};
