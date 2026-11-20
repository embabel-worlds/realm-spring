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
  DocumentedSettings: [
    { name: 'server.port', type: 'java.lang.Integer', deprecated: false },
    { name: 'spring.datasource.hikari.maximum-pool-size', type: 'java.lang.Integer', deprecated: false },
    { name: 'server.max-http-header-size', type: 'org.springframework.util.unit.DataSize', deprecated: true, level: 'error', since: '3.0.0', replacement: 'server.max-http-request-header-size' },
    { name: 'management.endpoint.health.group', type: 'java.util.Map<java.lang.String,Group>', deprecated: false }],
  SettingsWritten: [
    { name: 'server.port', value: '8080', file: 'shop-web/src/main/resources/application.yml', line: 2, link: null },
    { name: 'spring.datasource.hikari.maximumPoolSize', value: '10', file: 'shop-web/src/main/resources/application.yml', line: 5, link: null },
    { name: 'server.max-http-header-size', value: '16KB', file: 'shop-web/src/main/resources/application.yml', line: 7, link: null },
    { name: 'spring.jpa.open-in-veiw', value: 'false', file: 'shop-web/src/main/resources/application.yml', line: 9, link: null },
    { name: 'shop.cart.ttl', value: '30m', file: 'shop-web/src/main/resources/application.yml', line: 11, link: null },
    { name: 'shop.greeting', value: 'hello', file: 'shop-web/src/main/resources/application.yml', line: 12, link: null },
    { name: 'management.endpoint.health.group.ready.include', value: 'db', file: 'shop-web/src/main/resources/application.yml', line: 14, link: null },
    { name: 'region', value: 'eu', file: 'shop-web/src/main/resources/application.yml', line: 16, link: null },
    { name: 'shop.url', value: 'https://${region}.example', file: 'shop-web/src/main/resources/application.yml', line: 17, link: null },
    { name: 'acme.stray', value: 'x', file: 'shop-web/src/main/resources/application.yml', line: 19, link: null },
    { name: 'server.port', value: '80a', file: 'shop-web/src/main/resources/application-dev.yml', line: 2, link: null },
    { name: 'spring.datasource.hikari.maximum-pool-size', value: '${POOL:10}', file: 'shop-web/src/main/resources/application-dev.yml', line: 3, link: null },
    { name: 'expect.kind', value: 'x', file: 'shop-web/src/main/resources/cases/one.yml', line: 1, link: null },
    { name: 'webPort', value: '8082', file: 'shop-web/src/main/resources/.h2.server.properties', line: 1, link: null }],
  SettingsReadByCode: [
    { written: '@ConfigurationProperties(prefix = "shop.cart")', file: 'shop-web/src/main/kotlin/CartProperties.kt', line: 4 },
    { written: '@Value("\\${shop.greeting:hi}")', file: 'shop-web/src/main/kotlin/Greeter.kt', line: 9 },
    { written: '@Value("${shop.url}")', file: 'shop-api/src/main/java/Client.java', line: 12 }],
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
  FileSummary: { 'shop-web/src/main/kotlin/com/acme/shop/web/cart/Cart.kt': 'Holds the items of one shopping cart.',
                 'shop-web/src/main/kotlin/com/acme/shop/web/cart/CartController.kt': 'Serves the cart over HTTP.' },
  PackageSummary: [{ summary: 'The shopping cart: its contents and its HTTP endpoints.', files: 2, generatedAt: '2026-11-19T04:00:00Z' }],
  ModuleSummary: [{ module: 'shop-web', summary: 'The web layer of the shop.', files: 25, generatedAt: '2026-11-19T04:00:00Z' }],
  ProjectSummary: [{ summary: 'An online shop in three modules.', modules: 3, generatedAt: '2026-11-19T04:00:00Z' }],
  Beans: [{ bean: 'ApiConfig#clock', declaredBy: '@Bean method', profiles: [], conditions: [], language: 'java', module: 'shop-api', file: 'shop-api/src/main/java/ApiConfig.java', line: 9, link: null },
          { bean: 'CartController', declaredBy: '@RestController', profiles: [], conditions: [], language: 'kotlin', module: 'shop-web', file: 'shop-web/src/main/kotlin/CartController.kt', line: 12, link: null },
          { bean: 'CartService', declaredBy: '@Service', profiles: ['prod'], conditions: [], language: 'kotlin', module: 'shop-web', file: 'shop-web/src/main/kotlin/CartService.kt', line: 8, link: null }],
  Endpoints: [{ method: 'GET', route: '/cart', class: 'CartController', handler: 'show', language: 'kotlin', path: 'shop-web/src/main/kotlin/CartController.kt', line: 20, link: 'https://example.test/CartController.kt#L20' },
              { method: 'POST', route: '/cart/items', class: 'CartController', handler: 'add', language: 'kotlin', path: 'shop-web/src/main/kotlin/CartController.kt', line: 31, link: null }],
  BackgroundWork: [{ kind: 'KafkaListener', class: 'OrderEvents', method: 'onOrder', detail: 'orders.placed', language: 'kotlin', path: 'shop-web/src/main/kotlin/OrderEvents.kt', line: 14, link: null }],
  TransactionalMethods: [], OutboundHttp: [], DataModel: [], AccessRules: [],
  TransactionalWork: [{ class: 'CartService', method: 'checkout', calls: 6, writes: 2, reads: 3, readOnly: false, couldBeReadOnly: false, writeCalls: ['save', 'deleteAll'], readCalls: ['findById'], language: 'kotlin', path: 'shop-web/src/main/kotlin/CartService.kt', line: 30, link: null },
                      { class: 'CartService', method: 'total', calls: 2, writes: 0, reads: 2, readOnly: false, couldBeReadOnly: true, writeCalls: [], readCalls: ['findById', 'findAll'], language: 'kotlin', path: 'shop-web/src/main/kotlin/CartService.kt', line: 44, link: null }],
  ControllersUsingRepositories: [], EmbabelChecks: [],
  EmbabelModel: [{ kind: 'action', name: 'priceCart', class: 'CartAgent', description: null, takes: ['Cart'], produces: 'PricedCart', declared: '@Action', language: 'kotlin', path: 'shop-web/src/main/kotlin/CartAgent.kt', line: 12, link: null }],
  Docs: [{ source: 'Spring documentation', title: 'Spring Boot 4.0 Migration Guide', page: 'https://example.test/guide', passage: 'To use the Jackson 2 module add the following dependency.', score: 1.0 },
         { source: 'Added by your team', title: 'Our Jackson policy', page: 'spring-notes://github.com/acme/shop/our-jackson-policy', passage: 'We stay on Jackson 2 until the billing service has moved.', score: 0.8 }],
  DocsAnswer: [{ answer: 'Add the Jackson 2 module as a stop-gap [1]; this team stays on Jackson 2 for now [2].', titles: ['Spring Boot 4.0 Migration Guide', 'Our Jackson policy'], pages: ['https://example.test/guide', 'spring-notes://x'] }],
  IndexedProjects: [], IndexState: [{ registered: true, indexed: 120, lastIndexedAt: null }],
  SearchCode: [{ language: 'kotlin', kind: 'method', name: 'CartService.total', file: 'shop-web/src/main/kotlin/CartService.kt', score: 0.91, id: 'x' }],
  KnownIssues: [{ repository: 'spring-projects/spring-boot', number: 47695, title: 'ObjectMapper bean missing', state: 'closed', milestone: '4.0.1', comments: 4, opened: '2025-10-18', closed: '2025-10-19', link: 'https://example.test/issue' }],
  GradleStackCard: [],
  CodeChecks: [{ code: 'JAVA_FINAL_AUTOWIRED_FIELD', severity: 'warning', found: '@Autowired on a final field, which cannot be injected', class: 'CartService', member: 'clock', fix: 'Remove @Autowired from the field and take the dependency as a constructor parameter that assigns it.', language: 'kotlin', path: 'shop-web/src/main/kotlin/CartService.kt', line: 9, link: null }],
  BeanWiring: [{ bean: 'CartController', type: 'CartService', asWritten: 'CartService', injectedBy: 'constructor', declaredHere: true, candidates: ['CartService'], injected: 'CartService', resolution: 'the type itself', language: 'kotlin', file: 'shop-web/src/main/kotlin/CartController.kt', line: 12, link: null },
               { bean: 'CartController', type: 'ObjectMapper', asWritten: 'ObjectMapper', injectedBy: 'constructor', declaredHere: false, language: 'kotlin', file: 'shop-web/src/main/kotlin/CartController.kt', line: 12, link: null },
               { bean: 'CartService', type: 'Clock', asWritten: 'Clock', injectedBy: 'constructor', declaredHere: false, language: 'kotlin', file: 'shop-web/src/main/kotlin/CartService.kt', line: 8, link: null }],
  Profiles: [{ profile: 'dev', where: 'file', what: 'application-dev.yml', file: 'shop-web/src/main/resources/application-dev.yml', line: 1, link: null }],
};

/* mode: bigProject (a package's summary cannot be gathered) | slowSum (file summaries take 1.5 s) | ok | configFails | slowBeans | behind (project on 4.0.3) | mine (one project already kept) */
const stub = (mode) => `
  window.__calls = []; window.__writes = [];
  const FIX = ${JSON.stringify(FIX)}; const MODE = ${JSON.stringify(mode)};
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  window.embabel = { views: { invoke: async (name, args) => {
    window.__calls.push(name + ':' + JSON.stringify(args || {}));
    if (name === 'DocumentedSettings' && MODE === 'configFails') throw new Error("Stopped: building STRING values took more than the statement's work budget of 20,000,000 steps");
    if (name === 'UpgradeConfiguration') return [{ id: 'upgrade-config:x', severity: 'high', category: 'upgrade-blocker', title: 'server.max-http-header-size: removed', detail: 'd', fix: 'Rename it', file: 'a.yml', line: 2, link: null }];
    if (name === 'StackCard' && MODE === 'behind') return [Object.assign({}, FIX.StackCard[0], { bootVersion: '4.0.3', bootLine: '4.0.x', latestPatch: '4.0.9' })];
    if (name === 'MyProjects' && MODE === 'mine') return [{ key: 'https://github.com/acme/billing', name: 'acme/billing', bootVersion: '3.5.9', support: 'supported', read: 'github.com/acme/billing@abc', modules: 2, analysedAt: new Date(Date.now() - 7200000).toISOString(), failed: 0 }];
    if (name === 'Beans' && MODE === 'slowBeans') await wait(2500);
    if (name === 'PackageSummary' && MODE === 'bigProject') return { status: 'ok', rows: [], warnings: ["PARTIAL_RESULT: producer 'codePackageSummary' (collect): the items were not all gathered (would ask the source for 10606 distinct keys, exceeding maxAnchors 200)"] };
    if (name === 'FileSummary') { if (MODE === 'slowSum') await wait(1500); const t = FIX.FileSummary[args.path]; return t ? [{ path: args.path, summary: t, declarations: 4, generatedAt: '2026-11-19T04:00:00Z' }] : []; }
    if (!FIX[name]) throw new Error('no fixture for ' + name);
    /* the envelope as the appliance sends it for a short answer */
    if (MODE === 'partial' && name === 'SettingsWritten') return { status: 'SUCCEEDED', outcome: 'PARTIAL', data: FIX[name],
      warnings: [{ code: 'PARTIAL', message: 'The result may be incomplete.' }, { code: 'PARTIAL', message: 'Incomplete: based on the first 18327 rows, more exist' }, { code: 'COST', message: 'a cost note' }] };
    return FIX[name];
  } } };
  window.gateway = { repository: {
    createEntry: async (a) => { window.__writes.push('create:' + a.type + ':' + JSON.stringify(a.data)); return {}; },
    deleteEntry: async (a) => { window.__writes.push('delete:' + a.type + ':' + a.id); return {}; } },
    ingest: { document: async (a) => { window.__writes.push('ingest:' + a.uri + ':' + a.title + ':' + a.sourceKind); return {}; } },
    realms: { realmSyncDocuments: async (a) => { window.__writes.push('sync:' + a.realm + ':' + a.source); return {}; } } };`;

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

  console.log('a result that is partial');
  ({ page, errors } = await open(browser, 'partial'));
  await finished(page);
  const partialNote = await text(page, '#progress .outcome .partial');
  ok(partialNote.includes('1 result is partial') && partialNote.includes('a floor, not the whole'), 'the outcome says a result is partial, and what that means');
  await page.locator('#progress .partial summary').click();
  ok((await text(page, '#progress .outcome .partial')).includes('the settings check: more rows exist than it may read (based on the first 18327 rows, more exist); 1 part of its source could not be read'),
    'and opened, which result, and why: more rows than were read, and a part of the source that could not be read; a cost note is not one');
  ok(errors.length === 0, 'no console errors: ' + errors.join(' | '));
  await page.close();
  ({ page, errors } = await open(browser, 'ok'));
  await finished(page);
  ok(await page.locator('#progress .partial').count() === 0, 'a project whose results are whole says nothing about partial ones');
  await page.close();

  console.log('a project on the newest release');
  ({ page, errors } = await open(browser, 'ok'));
  await finished(page);
  ok((await text(page, '#progress .ptop b')) === 'Done — all 6 checks completed', 'the outcome says every check completed');
  const outcome = await text(page, '#progress .outcome');
  ok(outcome.includes('acme/shop at commit 1915b70') && outcome.includes('4 module(s)') && outcome.includes('310 Java types'), 'and what was read, in words: the repository, the commit, modules and types');
  ok(!outcome.includes('github.com/acme/shop@'), 'not as a raw id');
  ok(!outcome.includes('Kotlin'), 'no warning for a Kotlin project: every check reads Kotlin now');
  const inbox = await text(page, '#panel');
  ok(inbox.includes('server.max-http-header-size no longer binds') && inbox.includes('Use server.max-http-request-header-size instead'), 'configuration: a removed property is flagged with its replacement');
  ok(inbox.includes('Spring Boot binds no property spring.jpa.open-in-veiw'), 'a misspelt spring.* key is flagged');
  ok(inbox.includes('Undocumented setting acme.stray'), 'a key nothing documents or reads is flagged');
  ok(inbox.includes('server.port is "80a", which is not a whole number') && inbox.includes('Set it to a whole number'), 'a value the property\'s type cannot take is flagged with what it must be');
  ok(!inbox.includes('expect.kind') && !inbox.includes('webPort'), 'a YAML file of the project\'s own data, and a dot-file, are not Spring configuration and are left alone');
  ok(!inbox.includes('shop.cart.ttl') && !inbox.includes('shop.greeting') && !inbox.includes('shop.url') && !inbox.includes('Undocumented setting region'), 'keys under a @ConfigurationProperties prefix, read by @Value (Kotlin or Java) or by another setting are not');
  ok(!inbox.includes('maximumPoolSize') && !inbox.includes('server.port is "8080"') && !inbox.includes('health.group.ready') && !inbox.includes('POOL'), 'a documented key in another spelling, a valid value, a value held in a placeholder, and a key under a documented map, are not');
  ok(await page.locator('#tabs button[data-tab="inbox"] .count').innerText() === '6', 'the inbox holds 6 findings: two from the code rules (an import, a Kotlin declaration) and four from configuration');
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
  await page.waitForFunction(() => document.querySelector('#panel .sumbox .t')?.textContent.includes('The shopping cart'));
  const filesPanel = await text(page, '#panel');
  ok(filesPanel.includes('Holds the items of one shopping cart.') && filesPanel.includes('Serves the cart over HTTP.'), 'each file shows what it is for');
  ok(filesPanel.includes('Summaries: 2 of 2 files'), 'the count of summaries written is the fixture\'s two files');
  ok(filesPanel.includes('The shopping cart: its contents and its HTTP endpoints.'), 'and the package\'s summary heads the list');
  const sumCalls = (await page.evaluate(() => window.__calls)).filter((c) => /^(File|Package)Summary:/.test(c));
  ok(sumCalls.filter((c) => c.startsWith('FileSummary:')).length === 2 && sumCalls.filter((c) => c.startsWith('PackageSummary:')).length === 1 && sumCalls[sumCalls.length - 1].startsWith('PackageSummary:'),
     'two file summaries were asked for, then the package\'s once they were there');
  ok((await text(page, '#panel .crumbs')).includes('acme/shop at commit 1915b70') && (await text(page, '#panel .crumbs')).includes('shop-web') && (await text(page, '#panel .crumbs')).includes('com.acme.shop.web.cart'), 'the trail shows project, module and package');
  ok(page.url().includes('module=shop-web') && page.url().includes('pkg=com.acme.shop.web.cart') && page.url().includes('tab=structure'), 'and the address holds where you are');
  await page.reload(); await page.waitForSelector('#panel table a.mono');
  ok((await text(page, '#panel')).includes('CartController.kt'), 'a reload opens the same package again');
  await page.click('#panel .crumbs [data-nav="packages"]');
  ok(await page.locator('#panel tr[data-pkg]').count() === 3, 'the trail goes back to the module');
  ok((await text(page, '#panel tr[data-pkg="1"]')).includes('The shopping cart: its contents'), 'the package just opened shows its summary in the list; the others offer to write theirs');
  ok(await page.locator('#panel tr[data-pkg="0"] button[data-sum="package"]').count() === 1, 'a package not yet summarized has a button, and clicking it does not open the package');
  await page.click('#panel .sumbox button[data-sum="module"]');
  await page.waitForFunction(() => document.querySelector('#panel .sumbox .t')?.textContent.includes('The web layer of the shop.'));
  ok(await page.locator('#panel tr[data-pkg]').count() === 3, 'summarizing the module stays on the module');
  ok((await page.evaluate(() => window.__calls)).filter((c) => c.startsWith('ModuleSummary:')).length === 1, 'the module\'s summary was asked for once, after its packages');
  await page.click('#panel .crumbs [data-nav="modules"]');
  ok(await page.locator('#panel tr[data-module]').count() === 4, 'and back to the project');
  ok((await text(page, '#panel tr[data-module="1"]')).includes('The web layer of the shop.'), 'the module summarized shows its summary in the project\'s list');
  ok(await page.locator('#panel tr[data-module="3"] button[data-sum]').count() === 0, 'a module with no main source offers no summary');
  await page.click('#panel .sumbox button[data-sum="project"]');
  await page.waitForFunction(() => document.querySelector('#panel .sumbox .t')?.textContent.includes('An online shop in three modules.'));
  ok(await page.locator('#panel tr[data-module] button[data-sum="module"]').count() === 0, 'summarizing the project summarizes every module with main source first');
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
  console.log('application');
  await page.click('button[data-tab="app"]');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('found in main source'));
  let appText = await text(page, '#panel');
  ok(appText.includes('2 found in main source (2 in Kotlin)') && appText.includes('/cart/items') && appText.includes('CartController.add'), 'endpoints open first: two, counted by language, with route and handler');
  ok(await page.locator('#panel a[href="https://example.test/CartController.kt#L20"]').count() === 1, 'an endpoint with a line on the host links to it');
  ok(!(await page.evaluate(() => window.__calls.some(c => c.startsWith('BeanWiring')))), 'no other section is read until it is opened');
  await page.click('#panel [data-app="work"]');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('orders.placed'));
  ok((await text(page, '#panel')).includes('@KafkaListener') && (await text(page, '#panel')).includes('OrderEvents.onOrder'), 'a listener shows its kind, its topic and its method');
  await page.click('#panel [data-app="tx"]');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('CartService.checkout'));
  ok((await text(page, '#panel')).includes('candidate') && (await text(page, '#panel')).includes('save, deleteAll'), 'transactions show what each writes, and which could be read-only');
  await page.click('#panel [data-app="layers"]');
  await page.waitForFunction(() => document.querySelector('#panel .empty')?.textContent.includes('None.'));
  ok((await text(page, '#panel')).includes('0 found in main source'), 'a section with nothing says none were found');
  await page.click('#panel [data-app="embabel"]');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('CartAgent.priceCart'));
  ok((await text(page, '#panel')).includes('PricedCart'), 'an Embabel action shows what it takes and produces');
  await page.click('#panel [data-app="ask"]');
  await page.fill('#ask', 'jackson 3');
  await page.click('#askgo');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('Check it against them'));
  const asked = await text(page, '#panel');
  const askedLow = asked.toLowerCase();
  ok(asked.includes('stays on Jackson 2 for now [2]') && askedLow.includes('written by the appliance’s model from the 2 passages'), 'asking writes an answer from the passages, and says a model wrote it');
  ok(askedLow.includes('[1] spring boot 4.0 migration guide') && askedLow.includes('[2] our jackson policy') && askedLow.includes('added by your team'), 'the passages are numbered as the answer cites them, each saying where it is from');
  ok(asked.includes('#47695') && asked.includes('4.0.1'), 'with matching issues and the release that fixes each');
  ok(await page.locator('#panel a[href^="spring-notes"]').count() === 0, 'a document the team added is not shown as a web link');
  ok(await page.evaluate(() => window.__calls.filter(c => c.startsWith('Docs:') || c.startsWith('DocsAnswer:') || c.startsWith('KnownIssues:')).length) === 3, 'one search of each, made only when asked');
  await page.click('#addopen');
  await page.click('#docadd');
  ok((await text(page, '#panel')).includes('Give it a title and some text'), 'adding a document with nothing in it is refused, in words');
  await page.fill('#doctitle', 'Deploy Runbook!');
  await page.fill('#doctext', 'Restart the gateway last.');
  await page.click('#docadd');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('was added for this project'));
  ok(await page.evaluate(() => window.__writes.includes('ingest:spring-notes://github.com/acme/shop/deploy-runbook:Deploy Runbook!:spring-notes')), 'the document is stored under this project, by a name made from its title');
  await page.click('#indexdocs');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('is indexing the documents'));
  ok(await page.evaluate(() => window.__writes.includes('sync:spring:project-docs')), 'indexing the project’s own documents asks the appliance to run that source');
  await page.click('#panel [data-app="code"]');
  await page.fill('#codeq', 'where is the total computed');
  await page.click('#codego');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('added and the appliance is reading it now'));
  ok(await page.evaluate(() => window.__writes.some(w => w.startsWith('create:IndexedProject:')) && window.__writes.includes('sync:polyglot-code:code-declarations')), 'a project not in the code index is added to it and the index is asked to read it, and the page says so');
  ok(!(await page.evaluate(() => window.__calls.some(c => c.startsWith('SearchCode')))), 'and no search is run against an index that does not hold it yet');

  await page.click('#panel [data-app="wiring"]');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('Most asked for'));
  ok((await text(page, '#panel')).includes('3 found in main source'), 'wiring lists three injection points');
  await page.click('#panel td [data-wire="CartService"]');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('1 of 3 injection points ask for CartService'));
  ok(await page.locator('#panel table tr').count() === 2, 'clicking a type shows only what asks for it');
  await page.click('#panel [data-wire=""]');
  await page.waitForFunction(() => document.querySelector('#panel')?.textContent.includes('Most asked for'));
  ok((await text(page, '#panel [data-app="endpoints"]')).includes('2'), 'a section already read shows its count on its button');

  await page.click('button[data-tab="beans"]');
  /* The panel redraws once a second, at whatever phase the page's clock is in: by 1.7 s the last redraw was at 0.7 s or later, which reads as 1 s. */
  await page.waitForTimeout(1700);
  const loading = await text(page, '#panel');
  ok(/Reading every @Bean.*Kotlin.*— [1-9] s/.test(loading), 'while beans are read the panel says what is being read and for how long: ' + loading.trim().slice(0, 190));
  await page.click('button[data-tab="profiles"]');   /* a click while the slow call is in flight */
  await page.waitForSelector('#panel table');
  ok((await text(page, '#panel')).includes('application-dev.yml'), 'another tab opens while beans are still loading');
  await page.click('button[data-tab="beans"]');
  await page.waitForSelector('#panel table', { timeout: 6000 });
  ok((await text(page, '#panel')).includes('3 beans declared in main source (2 in Kotlin, 1 in Java)') && (await text(page, '#panel')).includes('CartService'), 'the beans arrive, counted by language as the fixture has them: 2 Kotlin, 1 Java');
  ok(!(await text(page, '#panel')).includes('Incomplete'), 'with no warning, since beans are read from Kotlin too');
  ok(errors.length === 0, 'no console errors: ' + errors.join(' | '));
  await page.close();

  console.log('summaries being written');
  ({ page, errors } = await open(browser, 'slowSum', '#project=' + encodeURIComponent(PROJECT) + '&tab=structure&module=shop-web&pkg=com.acme.shop.web.cart&set=main'));
  await page.waitForSelector('#panel .sumbar');
  const writing = await text(page, '#panel');
  ok(writing.includes('Writing summaries: 0 of 2 files') && /writing… \d+ s/.test(writing), 'while they are written the panel counts them and each row says it is being written: ' + writing.replace(/\s+/g, ' ').slice(0, 80));
  await page.click('#panel .crumbs [data-nav="packages"]');   /* a click while summaries are in flight */
  ok(await page.locator('#panel tr[data-pkg]').count() === 3, 'navigating away while they are written works');
  await page.waitForFunction(() => document.querySelector('#panel tr[data-pkg="1"]')?.textContent.includes('The shopping cart'), null, { timeout: 8000 });
  ok(true, 'and the package\'s summary arrives in the list it was left for');
  ok(errors.length === 0, 'no console errors: ' + errors.join(' | '));
  await page.close();

  console.log('a summary the appliance could not gather');
  ({ page, errors } = await open(browser, 'bigProject', '#project=' + encodeURIComponent(PROJECT) + '&tab=structure&module=shop-web&pkg=com.acme.shop.web.cart&set=main'));
  await page.waitForFunction(() => document.querySelector('#panel .sumbox .t')?.textContent.includes('Could not be written'));
  const big = await text(page, '#panel');
  ok(big.includes('cannot yet gather the summaries beneath it on a project this large'), 'a package summary that could not be gathered says so, and why, not "nothing to summarize"');
  ok(big.includes('Holds the items of one shopping cart.') && big.includes('Summaries: 2 of 2 files'), 'and the files\' summaries are still shown');
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
