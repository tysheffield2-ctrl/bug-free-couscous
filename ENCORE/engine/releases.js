/* Player release settlement shared by all ENCORE interfaces.
   Dependencies are explicit; this module never reads the DOM or saves a career. */
(function (global) {
  "use strict";
  function settle(s, h) {
    const {
      reach,
      reception,
      directionFor,
      rand,
      clamp,
      log,
      compact,
      outcome,
      adjustReleaseStreams,
      recordRegionalStreams,
      level,
    } = h;
    let count = 0,
      added = 0,
      debut = [];
    s.songs
      .filter((x) => x.released)
      .forEach((x) => {
        let n;
        if (x.factor === undefined) {
          let guest = x.feature ? s.world[x.feature.id] : null;
          let featureReach = guest
            ? x.feature.fans * (guest.relation <= -40 ? 0.004 : 0.018)
            : 0;
          x.base = reach(x);
          x.factor =
            reception(x.quality) *
            (x.songRules === 2 ? 0.55 + x.commercial * 0.009 : 1) *
            (x.mood.startsWith("Raw")
              ? rand(0.65, 1.4)
              : directionFor(x).reach) *
            (1 + s.boost) *
            (x.albumBoost === s.week ? 1.15 : 1);
          x.launchFans = s.fans;
          n = Math.round(x.base * x.factor);
          x.debutStreams = n;
          x.organic = n / (1 + s.boost) / (x.albumBoost === s.week ? 1.15 : 1);
          x.breakdown =
            "Expected reach " +
            compact(x.base) +
            "; quality " +
            x.quality +
            "/100" +
            (x.songRules === 2
              ? "; commercial potential " + x.commercial + "/100"
              : "") +
            "; " +
            x.mood.split(" /")[0].toLowerCase() +
            " direction" +
            (guest ? "; guest " + guest.name : "") +
            "; promotion " +
            Math.round(s.boost * 100) +
            "%. Audience reception helped determine the final " +
            x.factor.toFixed(2) +
            "× debut. " +
            (x.factor < 0.65
              ? "Try improving your craft before your next recording."
              : x.factor >= 1.5
                ? "This release outperformed its expected audience."
                : "This release performed within the expected range.");
          s.reputation = clamp(
            s.reputation +
              (x.quality >= 60 ? 1 : 0) +
              (x.factor >= 1.5 ? 2 : 0),
          );
          debut.push(x);
          log(
            "“" +
              x.title +
              "” debuted with " +
              compact(n) +
              " streams: " +
              outcome(x.factor).toLowerCase() +
              ".",
          );
        } else {
          let guest = x.feature ? s.world[x.feature.id] : null;
          let conflict = guest && guest.relation <= -40 ? 0.8 : 1;
          x.organic = Math.max(
            8,
            (x.organic ?? x.streams) * rand(...directionFor(x).decay) +
              (s.fans * 0.002) /
                Math.sqrt(
                  Math.max(1, s.songs.filter((x) => x.released).length),
                ),
          );
          n = Math.round(
            x.organic *
              (1 + s.boost) *
              conflict *
              (x.albumBoost === s.week ? 1.15 : 1),
          );
          if (
            x.songRules === 2 &&
            Math.random() <
              (0.005 + level("viralAbility") * 0.00045) * directionFor(x).viral
          ) {
            n = Math.round(n * rand(1.8, 3.5));
            log("“" + x.title + "” caught a viral discovery wave.");
          }
        }
        n = adjustReleaseStreams(x, n);
        recordRegionalStreams(x, n);
        if (x.released === s.week) {
          x.debutStreams = n;
          x.breakdown +=
            " Genre fit " +
            x.marketFit +
            "%; release spacing " +
            Math.round(x.rolloutFactor * 100) +
            "%.";
        }
        x.streams = n;
        x.total += n;
        count += n;
        added += Math.round(
          n *
            directionFor(x).fans *
            (1 + s.loyalty / 200) *
            (x.songRules === 2 ? 0.75 + level("charisma") * 0.005 : 1),
        );
      });
    return { count, added, debut };
  }
  global.ENCORE_RELEASES = { settle };
})(globalThis);
