/*
 * Drive the real page against a LIVE appliance: every view the page asks for is run on the appliance,
 * through whatever command `LIVE_VIEW` names (it is given the view's name and its arguments as JSON, and
 * prints the appliance's answer), so what is timed is what a reader waits for. Usage:
 *   LIVE_VIEW="python3 /path/to/mcp.py view_run" node tests/live.mjs <project key> [seconds] [screenshot.png]
 * Prints when the stack card appeared, each check's outcome and time as the page shows them, every view's
 * rows and seconds, and any console error.
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'apps/stack.html'), 'utf8');
const [project, seconds = '240', shot] = process.argv.slice(2);
const live = (process.env.LIVE_VIEW || '').split(' ').filter(Boolean);
if (!project || !live.length) { console.error('usage: LIVE_VIEW="<command>" node tests/live.mjs <project key> [seconds] [screenshot.png]'); process.exit(2); }

const calls = [];
const invoke = (name, args) => new Promise((resolve) => {
  const started = Date.now();
  execFile(live[0], [...live.slice(1), JSON.stringify({ name, params: args || {} })], { maxBuffer: 1 << 28, timeout: 300000 }, (err, stdout) => {
    const secs = (Date.now() - started) / 1000;
    let answer;
    try { answer = JSON.parse(stdout); } catch { answer = null; }
    const rows = answer && Array.isArray(answer.rows) ? answer.rows : null;
    calls.push({ name, secs, rows: rows ? rows.length : null, error: rows ? null : String(stdout || err || '').slice(0, 160) });
    resolve(rows ? { rows } : { error: String(stdout || err || 'no answer').slice(0, 400) });
  });
});

const stub = `
  window.embabel = { views: { invoke: async (name, args) => { const r = await window.__live(name, args || {}); if (r.error) throw new Error(r.error); return r.rows; } } };
  window.gateway = { repository: { createEntry: async () => ({}), deleteEntry: async () => ({}) }, ingest: { document: async () => ({}) }, realms: { realmSyncDocuments: async () => ({}), realmStatus: async () => ({}) } };`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1100 } });
const errors = [];
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });
page.on('pageerror', (e) => errors.push(String(e).slice(0, 200)));
await page.exposeFunction('__live', invoke);
const URL_ = 'http://world.test/apps/stack.html';
await page.route('**/*', (route) => {
  const u = route.request().url();
  if (u.startsWith(URL_)) return route.fulfill({ contentType: 'text/html', body: html });
  if (u.endsWith('/embabel.js')) return route.fulfill({ contentType: 'application/javascript', body: stub });
  if (u.endsWith('/gateway.js')) return route.fulfill({ contentType: 'application/javascript', body: '' });
  if (u.endsWith('/theme.css')) return route.fulfill({ contentType: 'text/css', body: '' });
  return route.fulfill({ status: 404, body: '' });
});
const started = Date.now();
const since = () => ((Date.now() - started) / 1000).toFixed(1) + ' s';
await page.goto(URL_ + '#project=' + encodeURIComponent(project));
try {
  await page.waitForFunction(() => /\d+\.\d+/.test(document.querySelector('#stack')?.textContent || ''), null, { timeout: Number(seconds) * 1000 });
  console.log('stack card shows a version after ' + since());
} catch { console.log('stack card showed no version within ' + seconds + ' s'); }
try {
  await page.waitForFunction(() => /^(Done|Finished)/.test(document.querySelector('#progress .ptop b')?.textContent || ''), null, { timeout: Number(seconds) * 1000 });
  console.log('all checks over after ' + since());
} catch { console.log('checks still running after ' + since()); }
console.log('\nprogress, as the page shows it:\n' + (await page.locator('#progress').innerText()).split('\n').filter(Boolean).join(' | '));
console.log('\nstack card:\n' + (await page.locator('#stack').innerText().catch(() => '')).split('\n').filter(Boolean).slice(0, 12).join(' | '));
console.log('\nviews asked for:');
for (const c of calls) console.log('  ' + c.name.padEnd(30) + String(c.rows ?? 'FAILED').padStart(7) + ' rows ' + c.secs.toFixed(1).padStart(6) + ' s' + (c.error ? '  ' + c.error.replace(/\s+/g, ' ') : ''));
console.log('\nconsole errors: ' + (errors.length ? '\n  ' + errors.join('\n  ') : 'none'));
if (shot) await page.screenshot({ path: shot, fullPage: true });
await browser.close();
