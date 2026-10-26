/* Canonical weekly phases, independent of rendering and persistence.
   Hooks retain the existing subsystem implementations during their migration. */
(function (global) {
  "use strict";
  function settle(s, h) {
    const {
      tickMarket,
      beginCareerWeek,
      settleLivingWorld,
      generateOpeningSlots,
      settleWorldTour,
      operationRate,
      settleAlbumSales,
      worldWeek,
      settleLabelWeek,
      albumStreams,
      compileSongs,
      updateChartRecords,
      settleAudience,
      applyAudienceEvent,
      updateCareerWorld,
      closeFinances,
      clamp,
      finishCareerWeek,
      scanAchievements,
      catalogReport,
      weeklyNews,
      log,
      compact,
      fmt,
      money,
    } = h;
    const releaseEngine=h.releases||global.ENCORE_RELEASES;
    if(!releaseEngine||typeof releaseEngine.settle!=="function")throw Error("Release Engine is unavailable.");
    tickMarket();
    beginCareerWeek();
    settleLivingWorld();
    generateOpeningSlots();
    settleWorldTour();
    const overheadRate = operationRate();
    let count = 0,
      added = 0,
      debut = [];
    ({ count, added, debut } = releaseEngine.settle(s, h));
    settleAlbumSales();
    worldWeek();
    settleLabelWeek();
    s.chartWeek = s.week;
    for (const a of s.albums)
      if (a.debutStreams === undefined && a.week === s.week)
        a.debutStreams = albumStreams(a);
    let rankings = compileSongs();
    updateChartRecords(rankings);
    rankings.forEach((x, i) => {
      if (x.you) {
        let track = s.songs.find((y) => y.id === x.id);
        track.peak = Math.min(track.peak || Infinity, i + 1);
      }
    });
    s.streams = count;
    s.total += count;
    added = settleAudience(count, added);
    added = applyAudienceEvent("streaming", added, {
      reach: s.expansion.listeners,
    });
    updateCareerWorld();
    let royalties = Math.round(count * 0.5 * 100) / 100;
    const financial = closeFinances(royalties, overheadRate);
    s.energy = 200;
    if (added > 0) s.loyalty = clamp(s.loyalty + 1);
    s.careerRecords.royalties += royalties;
    s.lastReport = {
      cashChange: financial.net,
      finance: financial,
      streams: count,
      fans: added,
      royalties,
      debut: debut.map((x) => x.id),
    };
    finishCareerWeek();
    let completed = s.week;
    const earned = scanAchievements();
    catalogReport(completed);
    weeklyNews(completed);
    s.week++;
    s.boost = 0;
    log(
      count
        ? compact(count) +
            " streams, " +
            fmt(added) +
            " net fans, and " +
            money(royalties) +
            " in royalties."
        : "A fresh week. New records are dropping around you.",
    );
    if (s.cash < 0)
      log("Your balance is below zero. Work shifts can cover the shortfall.");
    return { completed, count, added, debut, financial, earned };
  }
  global.ENCORE_WEEKLY = Object.freeze({version:2,settle});
})(globalThis);
