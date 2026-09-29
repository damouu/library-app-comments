import globals from "globals";
import tseslint from "typescript-eslint";
import sonarjs from "eslint-plugin-sonarjs";
import {defineConfig} from "eslint/config";

export default defineConfig([{
    ignores: ["dist/**", "node_modules/**", "coverage/**",],
},

    ...tseslint.configs.recommended,

    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],

        languageOptions: {
            globals: globals.node,
        },

        plugins: {
            sonarjs,
        },

        rules: {
            "complexity": ["error", {max: 10}],

            "sonarjs/cognitive-complexity": ["error", 15],

            "@typescript-eslint/no-unused-vars": ["error", {
                argsIgnorePattern: "^_",
            },],
        },
    },]);