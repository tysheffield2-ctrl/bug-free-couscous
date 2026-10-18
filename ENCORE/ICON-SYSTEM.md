# Black-and-gold icon system

Implements the October 18 approved reference in the production renderer.

- Thirteen scalable gold vector icons and circular destination buttons in More.
- Studio / Charts / Home / Business / More navigation with centered Home and active-page semantics.
- Next Move shortcuts for Studio, Charts, Touring and Business HQ.
- Record-shaped O in the Home wordmark, dark navy surfaces, gold borders and responsive mobile layouts.
- Department accents are remapped into a coordinated gold / champagne / brass family so older pastel screens no longer fight the approved shell. Green and red remain reserved for positive / negative state feedback.
- Existing destination search, Stats, sandbox entry, saves and simulation rules remain available.
- The thirteen primary icon destinations are shown first; deeper legacy utilities are retained in a collapsible All career screens & utilities section instead of duplicating the main destinations.

Releases opens the player's music catalog and release management. Catalog opens Contracts & Rights directly on Catalog Intelligence so ownership, valuation and leverage match the "Your legacy" meaning in the approved reference. Legal Affairs opens the persistent civil docket. Representation opens the modern Representation team market, not the retired standalone Agent interface.

Validation: `npm run build && node tests/icon-system.mjs`. The icon integration test opens all thirteen destinations, verifies ownership-aware Catalog routing, checks the five-button bottom navigation, prevents duplicate primary routes in More, verifies searchable access to Stats, and checks the black-and-gold palette contract. The icon test is also part of the fast CI and playtest publication gates. The separate experimental `/ui2` renderer is unchanged.
