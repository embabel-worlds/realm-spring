/*
 * Drives apps/stack.html in a real browser with the app runtime STUBBED.
 *
 * The rows are SYNTHETIC, written by hand in the shape live runs return (the live project this was
 * built against is private). They stand for a four-module Kotlin and Java build already on the
 * newest Spring Boot release, which is the case the page used to get wrong: it offered an upgrade
 * to the version the project was on, said nothing about what was read, and listed no project of
 * the reader's own.
 *
 *   node tests/stack.stub.mjs        (needs `playwright` resolvable; NODE_PATH works)
 */
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const html = readFileSync(fileURLToPath(new URL('../apps/stack.html', import.meta.url)), 'utf8');
const PROJECT = 'https://github.com/acme/shop';
const ORIGIN = 'http://world.test';
const URL_ = `${ORIGIN}/apps/spring/stack.html`;

const FIX = {
  StackCard: [{ bootVersion: '4.1.2', frameworkVersion: '7.0.10', bootLine: '4.1.x', ossSupportEnds: '2027-07-31', commercialSupportEnds: '2028-07-31',
                support: 'supported', javaVersions: '17 - 26', latestPatch: '4.1.2', newestLine: '4.1.x', newestSupportEnds: '2027-07-31' }],
  ProjectOverview: [{ project: 'github.com/acme/shop@1915b7016b3f', modules: ['a', 'b', 'c', 'd'], moduleCount: 4, types: 310, settings: 120, dependencies: 88 }],
  BootLines: [{ line: '4.1', latestPatch: '4.1.2', support: 'supported', javaVersions: '17 - 26' }, { line: '4.0', latestPatch: '4.0.9', support: 'supported', javaVersions: '17 - 25' },
              { line: '3.5', latestPatch: '3.5.16', support: 'supported', javaVersions: '17 - 25' }],
  Triage: [], MyProjects: [],
  ModernizationFindings: [{ id: 'rule:1', severity: 'low', category: 'modernize', title: 'Field injection', detail: 'd', fix: 'f', file: 'a/src/main/java/A.java', line: 3, link: null }],
  ModernizationFindingsInCode: [{ id: 'rule:2:shop-web/src/main/kotlin/Cart.kt#Cart.repo', severity: 'medium', category: 'design', title: 'Field injection: Cart.repo', detail: 'd', fix: 'f', file: 'shop-web/src/main/kotlin/Cart.kt', line: 7, link: null }],
  VulnerableDependencies: [], VersionOverrides: [],
  ModuleSources: [
    { module: 'shop-core', coordinates: 'com.acme:shop-core:1.0', packaging: 'jar', name: 'core', mainFiles: 40, testFiles: 12, languages: ['java', 'kt'] },
    { module: 'shop-web', coordinates: 'com.acme:shop-web:1.0', packaging: 'jar', name: 'web', mainFiles: 25, testFiles: 9, languages: ['kt'] },
    { module: 'shop-api', coordinates: 'com.acme:shop-api:1.0', packaging: 'jar', name: 'api', mainFiles: 6, testFiles: 0, languages: ['java'] },
    { module: '', coordinates: 'com.acme:shop-parent:1.0', packaging: 'pom', name: 'parent', mainFiles: 0, testFiles: 0, languages: [] }],
  ModulePackages: [
    { package: 'com.acme.shop.web', sourceSet: 'main', files: 20, languages: ['kt'] },
    { package: 'com.acme.shop.web.cart', sourceSet: 'main', files: 5, languages: ['kt'] },
    { package: 'com.acme.shop.web', sourceSet: 'test', files: 9, languages: ['kt'] }],
  PackageFiles: [
    { file: 'Cart.kt', language: 'kt', path: 'shop-web/src/main/kotlin/com/acme/shop/web/cart/Cart.kt', link: 'https://github.com/acme/shop/blob/1915b70/shop-web/src/main/kotlin/com/acme/shop/web/cart/Cart.kt' },
    { file: 'CartController.kt', language: 'kt', path: 'shop-web/src/main/kotlin/com/acme/shop/web/cart/CartController.kt', link: null }],
  FilesByExtension: [
    { extension: 'kt', files: 60, mainFiles: 45, testFiles: 15, modules: 2 }, { extension: 'java', files: 30, mainFiles: 24, testFiles: 6, modules: 2 },
    { extension: 'ts', files: 10, mainFiles: 0, testFiles: 0, modules: 1 }, { extension: 'yml', files: 12, mainFiles: 4, testFiles: 2, modules: 3 },
    { extension: 'zzz', files: 99, mainFiles: 0, testFiles: 0, modules: 1 }],
  Beans: [{ bean: 'ApiConfig#clock', declaredBy: '@Bean method', profiles: [], conditions: [], language: 'java', module: 'shop-api', file: 'shop-api/src/main/java/ApiConfig.java', line: 9, link: null },
          { bean: 'CartController', declaredBy: '@RestController', profiles: [], conditions: [], language: 'kotlin', module: 'shop-web', file: 'shop-web/src/main/kotlin/CartController.kt', line: 12, link: null },
          { bean: 'CartService', declaredBy: '@Service', profiles: ['prod'], conditions: [], language: 'kotlin', module: 'shop-web', file: 'shop-web/src/main/kotlin/CartService.kt', line: 8, link: null }],
  Profiles: [{ profile: 'dev', where: 'file', what: 'application-dev.yml', file: 'shop-web/src/main/resources/application-dev.yml', line: 1, link: null }],
};

/* mode: ok | configFails | slowBeans | behind (project on 4.0.3) | mine (one project already kept) */
const stub = (mode) => `
  window.__calls = []; window.__writes = [];
  const FIX = ${JSON.stringify(FIX)}; const MODE = ${JSON.stringify(mode)};
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  window.embabel = { views: { invoke: async (name, args) => {
    window.__calls.push(name + ':' + JSON.stringify(args || {}));
    if (name === 'ConfigurationProblems') {
      if (MODE === 'configFails') throw new Error("Stopped: building STRING values took more than the statement's work budget of 20,000,000 steps");
      return [];
    }
    if (name === 'UpgradeConfiguration') return [{ id: 'upgrade-config:x', severity: 'high', category: 'upgrade-blocker', title: 'server.max-http-header-size: removed', detail: 'd', fix: 'Rename it', file: 'a.yml', line: 2, link: null }];
    if (name === 'StackCard' && MODE === 'behind') return [Object.assign({}, FIX.StackCard[0], { bootVersion: '4.0.3', bootLine: '4.0.x', latestPatch: '4.0.9' })];
    if (name === 'MyProjects' && MODE === 'mine') return [{ key: 'https://github.com/acme/billing', name: 'acme/billing', bootVersion: '3.5.9', support: 'supported', read: 'github.com/acme/billing@abc', modules: 2, analysedAt: new Date(Date.now() - 7200000).toISOString(), failed: 0 }];
    if (name === 'Beans' && MODE === 'slowBeans') await wait(2500);
    if (!FIX[name]) throw new Error('no fixture for ' + name);
    return FIX[name];
  } } };
  window.gateway = { repository: {
    createEntry: async (a) => { window.__writes.push('create:' + a.type + ':' + JSON.stringify(a.data)); return {}; },
    deleteEntry: async (a) => { window.__writes.push('delete:' + a.type + ':' + a.id); return {}; } } };`;

let failures = 0;
const ok = (cond, what) => { console.log((cond ? '  ok   ' : '  FAIL ') + what); if (!cond) failures++; };

async function open(browser, mode, hash = '#project=' + encodeURIComponent(PROJECT)) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.route('**/*', (route) => {
    const u = route.request().url();
    if (u.startsWith(URL_)) return route.fulfill({ contentType: 'text/html', body: html });
    if (u.endsWith('/embabel.js')) return route.fulfill({ contentType: 'application/javascript', body: stub(mode) });
    if (u.endsWith('/gateway.js')) return route.fulfill({ contentType: 'application/javascript', body: '' });
    if (u.endsWith('/theme.css')) return route.fulfill({ contentType: 'text/css', body: '' });
    return route.fulfill({ status: 404, body: '' });
  });
  await page.goto(URL_ + hash);
  return { page, errors };
}
const text = (page, sel) => page.locator(sel).innerText();
const finished = (page) => page.waitForFunction(() => /^(Done|Finished)/.test(document.querySelector('#progress .ptop b')?.textContent || ''));

const browser = await chromium.launch();
try {
  console.log('before any project');
  let { page, errors } = await open(browser, 'ok', '');
  ok((await text(page, '#samples')).includes('No project of yours yet'), 'with no project of the reader\'s own, the samples are offered and say why');
  ok(await page.locator('#samples details').count() === 0, 'and are not tucked away');
  ok(await page.locator('#report').isHidden(), 'no report is shown before a project is read');
  await page.close();

  console.log('a project on the newest release');
  ({ page, errors } = await open(browser, 'ok'));
  await finished(page);
  ok((await text(page, '#progress .ptop b')) === 'Done — all 6 checks completed', 'the outcome says every check completed');
  const outcome = await text(page, '#progress .outcome');
  ok(outcome.includes('github.com/acme/shop@1915b7016b3f') && outcome.includes('4 module(s)') && outcome.includes('310 Java types'), 'and what was read: the commit, modules and types');
  ok(outcome.includes('65 Kotlin source files') && outcome.includes('configuration check still reads Java source only'), 'a Kotlin project is told the one check that still reads Java only, with the count (40 + 25 main files)');
  ok(await page.locator('#tabs button[data-tab="inbox"] .count').innerText() === '2', 'the inbox holds both halves of the code rules: one finding from imports, one from a Kotlin declaration');
  ok((await text(page, '#recommend')).includes('nothing to upgrade to'), 'on the newest release, no upgrade is offered');
  ok(!(await page.evaluate(() => window.__calls)).some((c) => c.startsWith('UpgradeConfiguration')), 'and no upgrade check is run against the version it is already on');
  await page.click('button[data-tab="upgrade"]');
  ok((await text(page, '#panel')).includes('newest supported release'), 'the Upgrade tab says so instead of offering 4.1.2 → 4.1.2');
  ok(await page.locator('#target').count() === 0, 'with no target to choose');

  console.log('what the project is made of');
  const made = await text(page, '#madeof');
  ok(made.includes('4') && made.includes('3 with source'), 'modules: four, three with source, as the fixture has');
  ok(/CODE FILES\s*100/i.test(made) && made.includes('in 3 language(s)'), 'code files: 60 Kotlin + 30 Java + 10 TypeScript = 100, in three languages');
  ok(made.includes('Kotlin') && made.includes('60% of code files'), 'the main language and its share');
  ok(made.includes('60 files') && made.includes('(45 main, 15 test)'), 'each language with its files, main and test');
  ok(made.includes('Also: YAML 12') && !made.includes('zzz') && !made.includes('99'), 'configuration formats are listed apart, and an unknown extension is not called a language');
  ok(await page.locator('#madeof .langbar i').count() === 3, 'one bar segment per language');

  console.log('your projects');
  const writes = await page.evaluate(() => window.__writes);
  ok(writes.some((w) => w.startsWith('create:SpringProject:') && w.includes('"key":"https://github.com/acme/shop"') && w.includes('"bootVersion":"4.1.2"') && w.includes('"failed":0')), 'the project read is kept, with its Spring Boot version and outcome');
  ok((await text(page, '#mine')).includes('Your projects (1)') && (await text(page, '#mine')).includes('acme/shop'), 'and is listed first, under Your projects');
  ok(await page.locator('#samples details.samples').count() === 1 && !(await page.locator('#samples details.samples').getAttribute('open')), 'the samples step aside into a closed section once the reader has a project');
  await page.click('#mine button[data-forget]');
  ok(await page.locator('#mine .proj').count() === 0, 'a project can be removed');
  ok((await page.evaluate(() => window.__writes)).filter((w) => w === 'delete:SpringProject:https://github.com/acme/shop').length >= 1, 'and the removal reaches the store');

  console.log('structure: project → module → package → file');
  await page.click('button[data-tab="structure"]');
  ok(await page.locator('#panel table.nav tr[data-module]').count() === 4, 'four modules, as the fixture has');
  ok((await text(page, '#panel')).includes('4 Maven module(s)'), 'counted in words');
  ok(await page.locator('#panel tr[data-module].go').count() === 3, 'the parent POM, with no source, is not a link');
  await page.click('#panel tr[data-module="1"]');
  await page.waitForSelector('#panel tr[data-pkg]');
  ok(await page.locator('#panel tr[data-pkg]').count() === 3, 'the module opens to its three package rows (main and test apart)');
  ok((await page.evaluate(() => window.__calls)).some((c) => c === 'ModulePackages:' + JSON.stringify({ project: 'https://github.com/acme/shop', module: 'shop-web' })), 'asked for that module by its directory');
  await page.click('#panel tr[data-pkg="1"]');
  await page.waitForSelector('#panel table a.mono');
  ok((await text(page, '#panel')).includes('2 file(s)') && (await text(page, '#panel')).includes('CartController.kt'), 'the package opens to its two files');
  ok((await page.evaluate(() => window.__calls)).some((c) => c.startsWith('PackageFiles:') && c.includes('"package":"com.acme.shop.web.cart"') && c.includes('"sourceSet":"main"')), 'asked for that package and source set');
  ok(await page.locator('#panel a[href*="Cart.kt"]').count() === 1, 'a file with a link on the host is linked; one without is plain text');
  ok((await text(page, '#panel .crumbs')).includes('shop-web') && (await text(page, '#panel .crumbs')).includes('com.acme.shop.web.cart'), 'the trail shows project, module and package');
  await page.click('#panel .crumbs a[data-nav="packages"]');
  ok(await page.locator('#panel tr[data-pkg]').count() === 3, 'the trail goes back to the module');
  await page.click('#panel .crumbs a[data-nav="modules"]');
  ok(await page.locator('#panel tr[data-module]').count() === 4, 'and back to the project');
  ok(await page.locator('#embabel-badge').isVisible() && (await text(page, '#embabel-badge')).trim().length > 0, 'the badge is visible and not empty');
  ok(errors.length === 0, 'no console errors: ' + errors.join(' | '));
  await page.close();

  console.log('a check that cannot complete');
  ({ page, errors } = await open(browser, 'configFails'));
  await finished(page);
  ok((await text(page, '#progress .ptop b')) === 'Finished — 1 of 6 checks could not complete', 'the outcome counts the check that failed');
  ok((await text(page, '#progress .step.fail')).includes('too large for the check'), 'and the failed check says why, in words');
  ok((await page.evaluate(() => window.__writes)).some((w) => w.includes('"failed":1')), 'the kept project records that a check failed');
  ok(errors.length === 0, 'no console errors: ' + errors.join(' | '));
  await page.close();

  console.log('a project behind the newest release');
  ({ page, errors } = await open(browser, 'behind'));
  await finished(page);
  ok((await text(page, '#recommend')).includes('Spring Boot 4.1.2'), 'a project on 4.0.3 is offered the newest release of its major, 4.1.2');
  ok((await page.evaluate(() => window.__calls)).some((c) => c.startsWith('UpgradeConfiguration:') && c.includes('"target":"4.1.2"')), 'and the upgrade check runs against it');
  await page.click('button[data-tab="upgrade"]');
  const options = await page.locator('#target option').allInnerTexts();
  ok(options.length === 2 && !options.some((o) => o.includes('3.5')), 'only releases newer than the project are offered: ' + options.join(' / '));
  await page.close();

  console.log('a panel still being read');
  ({ page, errors } = await open(browser, 'slowBeans'));
  await finished(page);
  await page.click('button[data-tab="beans"]');
  await page.waitForTimeout(1300);
  const loading = await text(page, '#panel');
  ok(/Reading every @Bean.*Kotlin.*— [1-9] s/.test(loading), 'while beans are read the panel says what is being read and for how long: ' + loading.trim().slice(0, 90));
  await page.click('button[data-tab="profiles"]');   /* a click while the slow call is in flight */
  await page.waitForSelector('#panel table');
  ok((await text(page, '#panel')).includes('application-dev.yml'), 'another tab opens while beans are still loading');
  await page.click('button[data-tab="beans"]');
  await page.waitForSelector('#panel table', { timeout: 6000 });
  ok((await text(page, '#panel')).includes('3 beans declared in main source (2 in Kotlin, 1 in Java)') && (await text(page, '#panel')).includes('CartService'), 'the beans arrive, counted by language as the fixture has them: 2 Kotlin, 1 Java');
  ok(!(await text(page, '#panel')).includes('Incomplete'), 'with no warning, since beans are read from Kotlin too');
  ok(errors.length === 0, 'no console errors: ' + errors.join(' | '));
  await page.close();

  console.log('a reader who already has a project');
  ({ page, errors } = await open(browser, 'mine', ''));
  await page.waitForSelector('#mine .proj');
  ok((await text(page, '#mine')).includes('acme/billing') && (await text(page, '#mine')).includes('Spring Boot 3.5.9') && (await text(page, '#mine')).includes('2 h ago'), 'their project is listed on arrival, with its version and when it was read');
  ok(await page.locator('#samples details.samples').count() === 1, 'and the samples are below it, closed');
  await page.click('#mine .proj');
  ok((await page.inputValue('#project')) === 'https://github.com/acme/billing', 'clicking it reads it again');
  await page.close();
} finally {
  await browser.close();
}
console.log(failures ? `\n${failures} FAILED` : '\nall passed');
process.exit(failures ? 1 : 0);
