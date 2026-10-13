# Wave 2 implementation boundaries

- No save reset, migration or sandbox key changes.
- No changes to streaming, chart, touring, negotiation, contract or finance simulation math in visual-only commits.
- Fix rendering defects at their source rather than hiding bad output with CSS.
- Prefer new coherent scene composition over adding another compatibility layer when markup changes are safe.
- Every new dynamic presentation surface should reject function/object/undefined implementation details before display.
- Mobile is the reference layout because current playtesting is primarily narrow-screen.
