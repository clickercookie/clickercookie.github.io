import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import stylistic from "@stylistic/eslint-plugin";

export default defineConfig([
    {
        ignores: ["public/**/*.js"],
    },
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: {
            js,
            "@stylistic": stylistic
        },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.browser },
        rules: {
            "eqeqeq": ["error", "always"],
            "prefer-const": ["error", {
                "destructuring": "any",
                "ignoreReadBeforeAssign": false
            }],
            "@stylistic/semi": ["error", "always", { "omitLastInOneLineBlock": true }],
            "@stylistic/no-extra-semi": "error",
            "@stylistic/semi-spacing": "error",
            "@stylistic/semi-style": "error",
            "@stylistic/quotes": ["error", "double"],
            "@stylistic/indent": ["error", 4],
            "@stylistic/space-before-function-paren": ["error", "never"],
            "@stylistic/key-spacing": "error"
        }
    },
    tseslint.configs.recommended,
]);
