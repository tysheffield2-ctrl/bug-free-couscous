# 0.9.30-beta.1 — Focused mobile career

The main interface now centers on songwriting, features, albums and tours. White list rows lead to dedicated screens, with one navigation history and one full-screen detail surface. The existing editorial Artist File is retained and scales down for phones.

- Compact phone typography and icons, safe-area navigation and readable touch targets.
- Song ideas, ordered album drafts and tour routes persist while moving between screens.
- Recording, mixing, releases and tour launches retain the existing engine and cost checks.
- Automatic briefing and coach overlays no longer interrupt forms. Weekly results use a compact detail screen.
- Feature profiles focus on relationships, requirements and booking. Missing guest fields no longer accidentally request artist zero.
- Saves, appearance, skills, career history, help and the separate sandbox remain under More.
- Investments, shopping, social feeds and business expansion are hidden in this focused interface; existing career data and obligations continue to be simulated.
- Raw static playtests load the shell relative to their hosted subdirectory and keep sandbox saves isolated.

Validation: full regression suite and focused integration tests; browser checks at phone widths from 320 to 430 CSS pixels. Browser testing uses Chromium phone-sized viewports, not physical iPhone Safari.
