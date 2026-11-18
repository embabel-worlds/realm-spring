/*
 * Drives apps/settings.html in a real browser with the app runtime STUBBED. Every view answers
 * from tests/fixtures: whole envelopes captured from live runs against a PetClinic with one
 * misspelt setting and one @Value nothing supplies (the repository and author are renamed).
 * Asserts what a reader sees: counts against the fixture rows, every interaction, forced empty
 * and error states, the badge, zero console errors, and a click while a delayed call is in flight.
 *
 *   node tests/settings.stub.mjs        (needs `playwright` resolvable; NODE_PATH works)
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const read = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');
const fix = (n) => JSON.parse(read(`./fixtures/${n}.json`));
const html = read('../apps/settings.html');
const PROJECT = 'https://github.com/example/petclinic@f86ff5a9497d383d6aa82cb561197a7390345924';
const FIX = {
  SettingsExplicit: fix('SettingsExplicit'), notable: fix('SettingsByDefault.notable'), all: fix('SettingsByDefault.all'),
  SettingsNeeded: fix('SettingsNeeded'), ConfigurationProblems: fix('ConfigurationProblems'), GitBlameLine: fix('GitBlameLine'),
};
const ORIGIN = 'http://world.test';
const URL_ = `${ORIGIN}/apps/realm-spring/settings.html`;

const stub = (mode) => `
  window.__calls = [];
  const FIX = ${JSON.stringify(FIX)}; const MODE = ${JSON.stringify(mode)};
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  window.embabel = { views: { invoke: async (name, args) => {
    window.__calls.push(name + ':' + JSON.stringify(args));
    if (MODE === 'error') { const e = new Error('upstream unavailable'); e.reason = 'FAILED'; throw e; }
    if (MODE === 'empty') { if (name === 'ConfigurationProblems') { const e = new Error('none'); e.reason = 'FETCHED_NOT_MATCHED'; throw e; } return { status: 'OK', rows: [] }; }
    if (name === 'SettingsByDefault') { if (!args.notableOnly) await wait(MODE === 'slow' ? 1500 : 0); return args.notableOnly ? FIX.notable : FIX.all; }
    if (name === 'GitBlameLine') { if (args.line !== 32) throw new Error('no fixture for GitBlameLine ' + JSON.stringify(args)); return FIX.GitBlameLine; }
    if (!FIX[name]) throw new Error('no fixture for ' + name);
    return FIX[name];
  } } };`;

let failures = 0;
const ok = (cond, what) => { console.log((cond ? '  ok   ' : '  FAIL ') + what); if (!cond) failures++; };

async function open(browser, mode, query = `?project=${encodeURIComponent(PROJECT)}`) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u.startsWith(URL_)) return route.fulfill({ contentType: 'text/html', body: html });
    if (u.endsWith('/embabel.js')) return route.fulfill({ contentType: 'application/javascript', body: stub(mode) });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.goto(URL_ + query);
  return { page, errors };
}

const browser = await chromium.launch();
try {
  console.log('live fixtures');
  let { page, errors } = await open(browser, 'ok');
  await page.waitForSelector('tr[data-set]');
  const set = FIX.SettingsExplicit.rows;
  ok(await page.locator('tr[data-set]').count() === set.length, `the table has every set line (${set.length})`);
  ok((await page.locator('.stat').nth(0).innerText()).startsWith(String(set.length)), 'the first figure is the number of set lines');
  ok(await page.locator('tr[data-set] .p-red').count() === FIX.ConfigurationProblems.rows.length, 'a setting that binds nothing is marked "no effect"');
  ok(await page.locator('tr[data-set]', { hasText: 'max-pool-size' }).locator('.p-red').count() === 1, 'and it is the misspelt pool size');
  ok(await page.locator('tr[data-set] .p-dim', { hasText: 'same as the default' }).count() === set.filter(r => r.sameAsDefault).length, 'a value equal to the default says so');
  ok((await page.locator('.stat').nth(3).innerText()).startsWith('1'), 'one setting is needed and supplied by nothing');
  ok(await page.evaluate(() => window.__calls.length) === 4, 'four calls on load, none for the full list of defaults');

  await page.locator('tr[data-set]', { hasText: 'max-pool-size' }).click();
  await page.waitForSelector('.who a');
  const who = await page.locator('.who').innerText();
  ok(who.includes('Ada Example') && who.includes('Raise the database pool to 30 connections'), 'opening a row says which change set it');

  await page.locator('.stat').nth(1).click();
  ok(await page.locator('.ncard').count() === FIX.notable.rows.length, `the watch list shows its ${FIX.notable.rows.length} defaults`);
  ok((await page.locator('.ncard', { hasText: 'maximum-pool-size' }).innerText()).includes("the library's own default"), 'a library default is labelled as the library\'s');
  await page.locator('#loadAll').click();
  await page.waitForSelector('details.area');
  const all = FIX.all.rows;
  ok((await page.locator('#panel').innerText()).includes(`${all.length} settings Spring Boot binds`), `the full list states its count (${all.length})`);
  ok(await page.locator('details.area tr').count() === all.length, 'and renders every one');
  await page.locator('#filter').fill('tomcat');
  const tomcat = all.filter(r => r.key.toLowerCase().includes('tomcat') || (r.description || '').toLowerCase().includes('tomcat')).length;
  ok(await page.locator('details.area tr').count() === tomcat, `the filter narrows to the ${tomcat} that mention tomcat`);
  await page.locator('#filter').fill('zzzz');
  ok((await page.locator('#panel').innerText()).includes('No setting matches'), 'a filter that matches nothing says so');

  await page.locator('.stat').nth(2).click();
  ok(await page.locator('#panel tbody tr').count() === FIX.ConfigurationProblems.rows.length, 'the no-effect panel lists each problem');
  await page.locator('.stat').nth(3).click();
  ok(await page.locator('#panel tbody tr').count() === FIX.SettingsNeeded.rows.length && await page.locator('#panel .p-red').count() === 1, 'the needed panel marks the unsupplied setting');

  const badge = page.locator('#embabel-badge');
  const box = await badge.boundingBox(); const vp = page.viewportSize();
  ok((await badge.innerText()).includes('Embabel') && await badge.locator('a[href="https://embabel.com"]').count() === 1 && box && box.y + box.height <= vp.height + 1, 'the badge is visible, says Embabel and links out');
  await page.locator('a[href="#how-it-works"]').click();
  ok(await page.locator('#how-it-works').isVisible() && await page.locator('#how-it-works details').count() === 3, 'How it works opens with the three views\' Cypher');
  ok(errors.length === 0, 'no console errors' + (errors.length ? ': ' + errors.join(' | ') : ''));
  await page.close();

  console.log('a click while the full list is still loading');
  ({ page, errors } = await open(browser, 'slow'));
  await page.waitForSelector('tr[data-set]');
  await page.locator('.stat').nth(1).click();
  await page.locator('#loadAll').click();
  await page.locator('.stat').nth(0).click();
  ok(await page.locator('tr[data-set]').count() === set.length, 'switching panels mid-load shows the set lines');
  await page.waitForTimeout(1800);
  ok(await page.locator('tr[data-set]').count() === set.length, 'the late answer does not replace the panel being read');
  await page.locator('.stat').nth(1).click();
  ok(await page.locator('details.area tr').count() === all.length, 'and the full list is there when returned to');
  ok(errors.length === 0, 'no console errors');
  await page.close();

  console.log('empty');
  ({ page, errors } = await open(browser, 'empty'));
  await page.waitForFunction(() => document.querySelector('#panel').innerText.includes('Nothing set'));
  ok(true, 'no application file is said in words');
  await page.locator('.stat').nth(2).click();
  ok((await page.locator('#panel').innerText()).includes('Every setting in the files'), 'no problems is said in words');
  ok(errors.length === 0, 'no console errors');
  await page.close();

  console.log('error');
  ({ page, errors } = await open(browser, 'error'));
  await page.waitForSelector('.err');
  ok((await page.locator('#panel').innerText()).includes('could not be read'), 'a failed read is an error, not an empty list');
  ok(await page.evaluate(() => window.__calls.length) === 4, 'and nothing is retried');
  await page.close();

  console.log('no project');
  ({ page, errors } = await open(browser, 'ok', ''));
  ok(await page.locator('#idle').isVisible() && await page.evaluate(() => window.__calls.length) === 0, 'nothing is read until a project is given');
  await page.close();
} finally { await browser.close(); }
console.log(failures ? `${failures} FAILED` : 'all passed');
process.exit(failures ? 1 : 0);
