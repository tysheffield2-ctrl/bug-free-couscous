// All writes and conflict checks remain in the UI2 save adapter.
render = () => {};
weekRecap = () => {};
queueSave = () => {};
backupCareer = () => true;
globalThis.onmessage = ({ data }) => {
  try {
    if (data?.type !== "advance-week") throw Error("Unknown engine command");
    const input = data.state;
    if (!!input?.sandbox !== SANDBOX) throw Error("Career mode mismatch");
    s = validateBundle({
      format: "encore-career",
      schemaVersion: 1,
      mode: SANDBOX ? "sandbox" : "career",
      state: JSON.parse(JSON.stringify(input)),
    });
    saveReady = true;
    saveConflict = false;
    migrateV083();
    const result = ENCORE_WEEK_TRANSACTION.run(s, {
      isMonthClosing: (week) => V083_isMonthClosing(week),
      settleMonthEnd: () => V083_settleMonthEnd(),
      settleWeek: () => advanceWeek(true),
      accumulate: ({ completed, beforeCash }) =>
        V083_accumulateWeek(completed, beforeCash),
    });
    if (!result.ok) throw result.error;
    if (result.state.week !== input.week + 1)
      throw Error("The week did not complete");
    s = validateBundle({
      format: "encore-career",
      schemaVersion: 1,
      mode: SANDBOX ? "sandbox" : "career",
      state: result.state,
    });
    globalThis.postMessage({
      ok: true,
      state: s,
      completed: result.completed,
      closing: result.closing,
      report: s.lastReport,
    });
  } catch (error) {
    globalThis.postMessage({
      ok: false,
      error: error.message || "The week could not complete",
    });
  }
};
