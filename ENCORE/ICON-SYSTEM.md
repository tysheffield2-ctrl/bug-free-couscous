# Black-and-gold icon system

Implements the October 18 reference in the production renderer:

- Thirteen scalable gold vector icons and circular destination buttons in More.
- Studio / Charts / Home / Business / More navigation with centered Home and active-page semantics.
- Next Move shortcuts for Studio, Charts, Touring and Business HQ.
- Record-shaped O in the Home wordmark, dark navy surfaces, gold borders and responsive mobile layouts.
- Existing destination search, Stats, sandbox entry, saves and simulation rules remain available.

Catalog opens the existing catalog investment screen; Releases opens the player's music catalog. Legal Affairs opens the existing civil docket; Representation opens the existing team market.

Validation: `npm run build && node tests/icon-system.mjs`. The route test opens all thirteen destinations and checks bottom-navigation state and searchable access to Stats. The separate experimental `/ui2` renderer is unchanged.
