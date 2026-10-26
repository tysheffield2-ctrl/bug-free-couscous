/* Player release settlement shared by all ENCORE interfaces.
   Dependencies are explicit; this module never reads the DOM or saves a career. */
(function (global) {
  "use strict";
  function finite(value, fallback = 0) {
    const n = Number(value);
    return Number.isFinite(n) ? n : fallback;
  }
  function focusLift(s, track) {
    const focus = s?.v133?.streamFocus;
    if (!focus || finite(focus.week, -1) !== finite(s.week, 0)) return 0;
    const songMatch =
      focus.kind === "songs" && finite(focus.id, -1) === finite(track.id, -2);
    const albumMatch =
      focus.kind === "albums" &&
      finite(focus.id, -1) === finite(track.album, -2);
    if (!songMatch && !albumMatch) return 0;
    const lift = Math.max(0, Math.min(0.3, finite(focus.lift, 0)));
    return albumMatch ? lift * 0.65 : lift;
  }
  function streamCeiling(s, track, lift = 0) {
    const fans = Math.max(0, finite(s?.fans, 0));
    const listeners = Math.max(0, finite(s?.expansion?.listeners, 0));
    const fanAudience = 260000000 * (1 - Math.exp(-fans / 35000000));
    const listenerAudience = 220000000 * (1 - Math.exp(-listeners / 45000000));
    const audience = Math.max(fanAudience, listenerAudience * 0.9);
    const quality = Math.max(0, Math.min(100, finite(track?.quality, 60))) / 100;
    const commercial =
      Math.max(0, Math.min(100, finite(track?.commercial, 55))) / 100;
    const reputation =
      Math.max(0, Math.min(100, finite(s?.reputation, 0))) / 100;
    const released = finite(track?.released, finite(s?.week, 1));
    const age = Math.max(0, finite(s?.week, 1) - released);
    const lifecycle = age === 0 ? 1.16 : age < 4 ? 1.08 : age < 12 ? 1 : 0.92;
    let ceiling =
      750000 +
      audience *
        (0.62 + quality * 0.22 + commercial * 0.14 + reputation * 0.12) *
        lifecycle;
    ceiling *= 1 + Math.max(0, lift) * 0.35;
    return Math.round(Math.max(750000, Math.min(400000000, ceiling)));
  }
  function normalizeStreams(s, track, demand) {
    const raw = Math.max(0, finite(demand, 0));
    const lift = focusLift(s, track);
    const pushed = raw * (1 + lift);
    const ceiling = streamCeiling(s, track, lift);
    const threshold = ceiling * 0.55;
    let final = pushed;
    if (pushed > threshold) {
      const room = Math.max(1, ceiling - threshold);
      final = threshold + room * (1 - Math.exp(-(pushed - threshold) / room));
    }
    final = Math.max(8, Math.round(Math.min(ceiling, final)));
    track.streamModel = {
      week: finite(s?.week, 0),
      raw: Math.round(raw),
      focusLift: lift,
      ceiling,
      final,
      saturated: pushed > threshold,
    };
    return final;
  }
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
          const strategyLift = Number.isFinite(Number(x.releaseStrategyLift))
            ? clamp(Number(x.releaseStrategyLift), 0.78, 1.22)
            : 1;
          x.factor =
            reception(x.quality) *
            (x.songRules === 2 ? 0.55 + x.commercial * 0.009 : 1) *
            (x.mood.startsWith("Raw")
              ? rand(0.65, 1.4)
              : directionFor(x).reach) *
            (1 + s.boost) *
            (x.albumBoost === s.week ? 1.15 : 1) *
            strategyLift;
          x.base = reach(x);
          x.launchFans = s.fans;
          n = Math.round(x.base * x.factor);
          x.debutStreams = n;
          x.organic =
            n / (1 + s.boost) / (x.albumBoost === s.week ? 1.15 : 1);
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
            "%" +
            (strategyLift !== 1
              ? "; release strategy " +
                (strategyLift >= 1 ? "+" : "") +
                Math.round((strategyLift - 1) * 100) +
                "%"
              : "") +
            ". Audience reception helped determine the final " +
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
        n = normalizeStreams(s, x, n);
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
  global.ENCORE_RELEASES = { settle, focusLift, streamCeiling, normalizeStreams };
})(globalThis);
