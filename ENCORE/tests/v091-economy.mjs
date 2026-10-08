import assert from 'node:assert/strict';
import {harness} from './harness.mjs';

const h=harness('/sandbox',24680);await h.run('boot()');
h.run("s.finance=initialFinance(s.week);recordIncome('media',100000);recordIncome('wages',25000);recordIncome('investment',5000);s.finance.week.expenses=10000;globalThis.r=closeFinances(20000,0)");
assert.equal(h.run('r.media'),100000);
assert.equal(h.run('r.wages'),25000);
assert.equal(h.run('r.investment'),5000);
assert.equal(h.run('r.revenue'),150000);
assert.ok(h.run('r.effectiveTaxRate>0'));
assert.ok(h.run("financeRows(r,true).some(x=>x[0]==='Commercial deals & endorsements'&&x[1].includes('$100,000'))"));
assert.ok(h.run("financeRows(r,true).some(x=>x[0]==='Effective income tax rate'&&x[1].includes('%'))"));
assert.ok(h.run("financeRows(r,true).some(x=>x[0].startsWith('Tax reserve set aside')&&x[0].includes('% effective'))"));

const p=harness('/sandbox',13579);await p.run('boot()');
p.run("migrateSocial();s.social.followers=10000;s.social.lastWeek=0;s.social.v091OrganicWeek=0;s.streams=2500000;migrateCareerWorld();s.careerWorld.momentum=80;s.development.marketability.level=70;s.development.viralAbility.level=70;globalThis.before=s.social.followers;globalThis.gain=finishSocialWeek()");
assert.ok(p.run('gain>0'));
assert.ok(p.run('s.social.followers>before'));
assert.ok(p.run('s.social.weekly.some(x=>x.week===s.week&&x.net>0)'));

console.log('PASS complete commercial income recap, visible effective/marginal tax rates, and organic PULSE follower growth.');
