module.exports = {
  extends: [
    '@basis-theory/eslint-config/typescript',
    'plugin:cypress/recommended',
  ],
  rules: {
    'cypress/no-unnecessary-waiting': 'off',
    'new-cap': 'off',
    camelcase: 'off',
    'get-off-my-lawn/prefer-arrow-functions': 'off',
  },
};
