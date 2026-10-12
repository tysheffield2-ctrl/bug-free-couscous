# ENCORE 0.9.4 implementation notes

This pass upgrades the dedicated Artist File, adds pre- and post-release hype for songs and albums, and exposes PULSE followers plus engagement-rate editing only inside ENCORE LAB.

Key rules:
- Hype is 0–100 with a true MAX HYPE state.
- Up to three hype actions may be used per release per simulated week.
- Unreleased hype decays more slowly than released hype.
- Launch-week hype can materially increase discovery, but quality, market fit, audience size, timing, touring, social activity, labels, and other systems still matter.
- Album hype is planned before release by title and transfers into the matching released album.
- Normal careers never expose PULSE follower or engagement-rate edit fields.
