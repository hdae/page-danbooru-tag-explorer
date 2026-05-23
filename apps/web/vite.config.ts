import { defineConfig } from "vite-plus";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { comlink } from "vite-plugin-comlink";
import license, { type Dependency } from "rollup-plugin-license";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const outDir = resolve(__dirname, "dist");

const collectedDeps = new Map<string, Dependency>();

const formatAuthor = (a: Dependency["author"]) =>
  typeof a === "string"
    ? a
    : a
      ? [a.name, a.email && `<${a.email}>`, a.url].filter(Boolean).join(" ")
      : "";

const formatDep = (d: Dependency) =>
  [
    `Name: ${d.name ?? "(anonymous)"}`,
    `Version: ${d.version ?? "?"}`,
    `License: ${d.license ?? "UNKNOWN"}`,
    d.author ? `Author: ${formatAuthor(d.author)}` : null,
    d.repository
      ? `Repository: ${typeof d.repository === "string" ? d.repository : (d.repository.url ?? "")}`
      : null,
    d.homepage ? `Homepage: ${d.homepage}` : null,
    d.description ? `Description: ${d.description}` : null,
    "",
    d.licenseText ?? "(no license text bundled)",
  ]
    .filter((v) => v !== null)
    .join("\n");

const noticeTemplate = (deps: Dependency[]) => {
  for (const d of deps) collectedDeps.set(`${d.name ?? ""}@${d.version ?? ""}`, d);
  return Array.from(collectedDeps.values())
    .sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""))
    .map(formatDep)
    .join("\n\n---\n\n");
};

const notice = () =>
  license({
    thirdParty: {
      output: {
        file: resolve(outDir, "NOTICE.txt"),
        template: noticeTemplate,
      },
    },
  });

// https://vite.dev/config/
export default defineConfig({
  base: "",
  build: {
    outDir,
  },
  lint: {
    plugins: ["oxc", "typescript", "unicorn", "react"],
    categories: {
      correctness: "warn",
    },
    env: {
      builtin: true,
    },
    ignorePatterns: ["dist"],
    overrides: [
      {
        files: ["**/*.{ts,tsx}"],
        rules: {
          "constructor-super": "error",
          "for-direction": "error",
          "getter-return": "error",
          "no-async-promise-executor": "error",
          "no-case-declarations": "error",
          "no-class-assign": "error",
          "no-compare-neg-zero": "error",
          "no-cond-assign": "error",
          "no-const-assign": "error",
          "no-constant-binary-expression": "error",
          "no-constant-condition": "error",
          "no-control-regex": "error",
          "no-debugger": "error",
          "no-delete-var": "error",
          "no-dupe-class-members": "error",
          "no-dupe-else-if": "error",
          "no-dupe-keys": "error",
          "no-duplicate-case": "error",
          "no-empty": "error",
          "no-empty-character-class": "error",
          "no-empty-pattern": "error",
          "no-empty-static-block": "error",
          "no-ex-assign": "error",
          "no-extra-boolean-cast": "error",
          "no-fallthrough": "error",
          "no-func-assign": "error",
          "no-global-assign": "error",
          "no-import-assign": "error",
          "no-invalid-regexp": "error",
          "no-irregular-whitespace": "error",
          "no-loss-of-precision": "error",
          "no-misleading-character-class": "error",
          "no-new-native-nonconstructor": "error",
          "no-nonoctal-decimal-escape": "error",
          "no-obj-calls": "error",
          "no-prototype-builtins": "error",
          "no-redeclare": "error",
          "no-regex-spaces": "error",
          "no-self-assign": "error",
          "no-setter-return": "error",
          "no-shadow-restricted-names": "error",
          "no-sparse-arrays": "error",
          "no-this-before-super": "error",
          "no-unassigned-vars": "error",
          "no-undef": "error",
          "no-unexpected-multiline": "error",
          "no-unreachable": "error",
          "no-unsafe-finally": "error",
          "no-unsafe-negation": "error",
          "no-unsafe-optional-chaining": "error",
          "no-unused-labels": "error",
          "no-unused-private-class-members": "error",
          "no-unused-vars": "error",
          "no-useless-assignment": "error",
          "no-useless-backreference": "error",
          "no-useless-catch": "error",
          "no-useless-escape": "error",
          "no-with": "error",
          "preserve-caught-error": "error",
          "require-yield": "error",
          "use-isnan": "error",
          "valid-typeof": "error",
          "no-array-constructor": "error",
          "no-unused-expressions": "error",
          "typescript/ban-ts-comment": "error",
          "typescript/no-duplicate-enum-values": "error",
          "typescript/no-empty-object-type": "error",
          "typescript/no-explicit-any": "error",
          "typescript/no-extra-non-null-assertion": "error",
          "typescript/no-misused-new": "error",
          "typescript/no-namespace": "error",
          "typescript/no-non-null-asserted-optional-chain": "error",
          "typescript/no-require-imports": "error",
          "typescript/no-this-alias": "error",
          "typescript/no-unnecessary-type-constraint": "error",
          "typescript/no-unsafe-declaration-merging": "error",
          "typescript/no-unsafe-function-type": "error",
          "typescript/no-wrapper-object-types": "error",
          "typescript/prefer-as-const": "error",
          "typescript/prefer-namespace-keyword": "error",
          "typescript/triple-slash-reference": "error",
          "react/rules-of-hooks": "error",
          "react/exhaustive-deps": "warn",
          "react/only-export-components": [
            "error",
            {
              allowConstantExport: true,
            },
          ],
        },
        env: {
          browser: true,
        },
      },
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
    jsPlugins: [
      {
        name: "vite-plus",
        specifier: "vite-plus/oxlint-plugin",
      },
    ],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
    },
  },
  plugins: [react(), tailwindcss(), comlink(), notice()],
  worker: {
    plugins: () => [comlink(), notice()],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
