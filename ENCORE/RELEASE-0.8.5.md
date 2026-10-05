# ENCORE 0.8.5-beta.1 — Marketing Scale Pass

## Always-on catalog campaigns

Catalog marketing can now run as a recurring weekly campaign instead of only a one-week purchase. The selected tier renews automatically each week until the player stops it or can no longer afford the charge.

Campaign tiers:

- Grassroots — $50/week — +18% catalog streams — +2% fan conversion
- Targeted campaign — $2,500/week — +40% catalog streams — +5% fan conversion
- National campaign — $50,000/week — +65% catalog streams — +10% fan conversion
- Major push — $250,000/week — +78% catalog streams — +15% fan conversion
- Catalog Takeover — $750,000/week — +90% catalog streams — +25% fan conversion
- Global Saturation — $2,000,000/week — +115% catalog streams — +35% fan conversion
- Icon Campaign — $5,000,000/week — +150% catalog streams — +50% fan conversion

The marketing screen shows weekly cost, stream lift, fan-conversion lift, weeks funded, total spend and auto-renew status. Campaigns can be stopped or resumed. If the player cannot afford the next renewal, the campaign pauses automatically rather than creating invalid cash state.

## Album rollout upgrades

Album rollouts remain 8, 12 or 16 weeks, but the available campaign scales and bonuses are significantly stronger:

- Focused — $25,000/week — +35% base reach
- Major push — $100,000/week — +55% base reach
- National era — $250,000/week — +75% base reach
- Global era — $750,000/week — +100% base reach
- Icon rollout — $2,000,000/week — +130% base reach

12-week rollouts add another +10 percentage points of sustained reach. 16-week rollouts add +20 percentage points. Rollout tiers also increase fan conversion while active.

## Compatibility

- Existing saves migrate automatically through `s.v086`.
- Existing one-off channel marketing remains available and can stack with eligible recurring catalog campaigns.
- Existing label marketing and rollout systems remain in place underneath the new late-loaded compatibility layer.
- Switching recurring campaign tiers replaces the current paid tier without accidentally stacking the previous tier's boost.

## Testing

A dedicated regression checks:

- the $750K Catalog Takeover tier,
- +90% stream lift,
- weekly recurring billing,
- persistent auto-renew state,
- automatic pause when cash is insufficient,
- fan conversion lift,
- stronger rollout tiers,
- 0.8.5 build/version wiring.
