module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    "extends": ["airbnb", "prettier", "plugin:node/recommended"],
    "plugins": ["prettier"],
    "rules": {
        "prettier/prettier": "error",
        "no-unused-vars": "warn",
        "no-console": "off",
        "func-names": "off",
        "no-process-exit": "off",
        "object-shorthand": "off",
        "class-methods-use-this": "off",
        "no-underscore-dangle": "warn"
    }
};
