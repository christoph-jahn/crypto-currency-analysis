module.exports = {
  env: {
    browser: false,
    es6: true,
    node: true,
    mocha: true,
  },
  extends: [
    'airbnb-base',
    'plugin:chai-friendly/recommended',
  ],
  rules: {
    'max-len': ['warn', { code: 120 }],
  },
};
