# Dynamic UI output guardrail

Wave 2 fixed the concrete Home chart-function leak at its source and added a regression for it. `v104-runtime-guard.js` contains a small safe-display helper for future dynamic surfaces; it is intentionally not wired globally yet because silently coercing existing gameplay output would be a broader behavior change. Adopt it selectively as individual screens are migrated.
