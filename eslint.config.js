import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginTS from '@typescript-eslint/eslint-plugin'
import eslintParserTS from '@typescript-eslint/parser'
import eslintConfigPrettier from 'eslint-config-prettier'

export default [
    {
        ignores: ['node_modules/', 'dist/'],
    },
    eslintConfigPrettier,
    {
        files: ['**/*.{js,ts,jsx,tsx}'],
        languageOptions: {
            parser: eslintParserTS,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        plugins: {
            react: eslintPluginReact,
            'react-hooks': eslintPluginReactHooks,
            '@typescript-eslint': eslintPluginTS,
        },
        rules: {
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'no-debugger': 'error',
            'prefer-const': 'error',
            eqeqeq: ['error', 'always'],

            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'warn',

            'react/jsx-max-props-per-line': ['error', { maximum: 1, when: 'multiline' }],
            'react/jsx-boolean-value': ['error', 'always'],
            'react/no-array-index-key': 'warn',
            'react-hooks/exhaustive-deps': 'warn',
            'react/self-closing-comp': 'warn',
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
    },
]
