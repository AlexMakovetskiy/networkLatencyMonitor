module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:sonarjs/recommended",
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh'],
	rules: {
	'react-refresh/only-export-components': [
		'warn',
		{ allowConstantExport: true },
	],
	"react/react-in-jsx-scope": "off",
		"camelcase": "error",
		"spaced-comment": "error",
		"quotes": ["error", "double"],
		"jsx-quotes": ["error", "prefer-double"],
		"react/no-unknown-property": "off",
		"no-duplicate-imports": "error",
		"no-console": "warn",
		"import/no-unresolved": "warn",
		"prefer-const": "warn",
		"max-len": ["error", { "code": 12000 }],
		"no-magic-numbers": ["warn", {
			"ignore": [1, 0, -1, 2], 
			"ignoreArrayIndexes": true,
			"ignoreDefaultValues": true
			}
		],
	"sonarjs/no-duplicate-string": "warn",
	"sonarjs/prefer-immediate-return": "warn",
	"@typescript-eslint/no-inferrable-types": "off",
	"import/order": [
		"error",
		{
			"groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
			"newlines-between": "always-and-inside-groups"
		}
	]
	},
}
