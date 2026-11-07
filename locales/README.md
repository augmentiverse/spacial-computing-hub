# Future localization plan — not active in Edition 01

Edition 01 ships exclusively in English. Keep a single canonical content model.

## Recommended next steps

1. Extract interface strings currently in `app.js` into a translation dictionary with keys, starting with `en.json`.
2. Extract localized fields for `technologies`, `tools`, `standards`, `docs`, `paths`, and `glossary` into per-locale catalog files. Do not translate URLs, technical identifiers, commands, or licensing terms without verification.
3. Support language-prefixed routes (`/en/`, `/fr/`, `/ar/`) and a visible language switcher that retains the current resource where a translation exists.
4. Set `document.documentElement.lang` and `dir`: `en`/`fr` → `ltr`; `ar` → `rtl`. Adapt sidebar positioning, breadcrumb direction, icons and code blocks carefully (code should remain LTR).
5. Provide localized SEO metadata and `hreflang` links only once localized pages actually exist.
6. Preserve primary sources in their original language and supply translated explanations, not machine-translated excerpts that could distort a standard.
7. Add language-specific proofreading, terminology QA and accessibility testing before release.

Do not display French or Arabic as available until those editions are actually completed.
