/* ENCORE 0.8.3 migration hardening. */
const V083_migrateBase=migrateV083;
migrateV083=function(){const first=!s.v083;V083_migrateBase();if(first){if(s.v081){s.v081.lastSettledMonth=Math.min(Number.isFinite(s.v081.lastSettledMonth)?s.v081.lastSettledMonth:-1,s.empire.month-1);if(s.v081.sports)s.v081.sports.lastSettledMonth=Math.min(Number.isFinite(s.v081.sports.lastSettledMonth)?s.v081.sports.lastSettledMonth:-1,s.empire.month-1)}if(s.v082)s.v082.lastSettledMonth=Math.min(Number.isFinite(s.v082.lastSettledMonth)?s.v082.lastSettledMonth:-1,s.empire.month-1)}};
