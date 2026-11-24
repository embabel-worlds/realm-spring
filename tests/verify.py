#!/usr/bin/env python3
"""The ladder for realm-spring. See tests/verify.sh for the layers and how to run it.

Ground truth is the source asked directly — never the realm's own earlier answer. The project read
is pinned to a commit, so its code cannot move under the check.
"""
import base64, glob, json, os, re, subprocess, sys, tempfile, urllib.parse, urllib.request

import yaml

BASE = os.environ.get('APPLIANCE', 'http://127.0.0.1:8080').rstrip('/')
CREDS = os.environ.get('AUTH') or os.environ.get('EMBABEL_AUTH') or sys.exit('set AUTH=user:pass')
AUTH = 'Basic ' + base64.b64encode(CREDS.encode()).decode()

REPO, SHA = 'https://github.com/spring-projects/spring-petclinic', '500158f732419217507c7656904b8e6aa1bcc0d6'
PROJECT = f'{REPO}@{SHA}'
# One exact version deps.dev records several advisories against.
COMPONENT = ('org.springframework', 'spring-web', '5.3.0')
SBOM = json.dumps({'bomFormat': 'CycloneDX', 'specVersion': '1.5', 'components': [{
    'type': 'library', 'group': COMPONENT[0], 'name': COMPONENT[1], 'version': COMPONENT[2],
    'purl': f'pkg:maven/{COMPONENT[0]}/{COMPONENT[1]}@{COMPONENT[2]}'}]})
WORDS = 'JacksonAutoConfiguration ObjectMapper'
# A running app's actuator, given as the endpoint's JSON: the input is its own ground truth.
CONDITIONS = json.dumps({'contexts': {'app': {'positiveMatches': {}, 'unconditionalClasses': [], 'negativeMatches': {
    'RedisAutoConfiguration': {'notMatched': [{'condition': 'OnClassCondition',
                                               'message': "@ConditionalOnClass did not find required class 'org.springframework.data.redis.core.RedisOperations'"}],
                               'matched': []}}}}})
BEANS = json.dumps({'contexts': {'app': {'beans': {
    'orderService': {'aliases': [], 'scope': 'singleton', 'type': 'com.example.OrderService',
                     'resource': 'file [OrderService.class]', 'dependencies': ['orderRepository']},
    'orderRepository': {'aliases': [], 'scope': 'singleton', 'type': 'com.example.OrderRepository',
                        'resource': None, 'dependencies': []}}}}})
ENV = json.dumps({'activeProfiles': [], 'propertySources': [
    {'name': 'systemProperties', 'properties': {'server.port': {'value': '9090'}}},
    {'name': 'Config resource \'class path resource [application.properties]\'',
     'properties': {'server.port': {'value': '8080', 'origin': 'class path resource [application.properties] - 1:13'}}}]})
ACTUATOR = {'WhyNotApplied': CONDITIONS, 'RuntimeBeans': BEANS, 'EffectiveSettings': ENV}

# A required param is given a fixed public value; every other param runs on its default.
REQUIRED = {'project': PROJECT, 'words': WORDS, 'target': '4.0.0', 'actuator': SBOM}

fails = []
def check(cond, label, detail=''):
    print(('ok   ' if cond else 'FAIL ') + label + (f'  [{detail}]' if detail and not cond else ''), flush=True)
    if not cond: fails.append(label)

def http(url, body=None, headers=None, timeout=900):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None,
                                 headers=dict({'Content-Type': 'application/json'}, **(headers or {})))
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode())

def view(name, args):
    """The envelope a page receives: `data`, `outcome`, `metrics.externalCalls`."""
    try:
        d = http(f'{BASE}/api/v1/views/{name}/invoke', {'args': args}, {'Authorization': AUTH})
    except urllib.error.HTTPError as e:
        return {'error': f'HTTP {e.code}: {e.read().decode()[:300]}'}
    return d

def rows(d): return d.get('data') or []
def calls(d): return (d.get('metrics') or {}).get('externalCalls')
def failed(d): return d.get('error') or (d.get('status') == 'FAILED' and json.dumps(d)[:300])

# ---- L1: every view, by name ------------------------------------------------------------------
print('== L1: every view answers by name')
views = []
for f in sorted(glob.glob('views/*.yml')):
    views += yaml.safe_load(open(f)) or []
answers = {}
for v in views:
    params = v.get('params') or {}
    args = {p: REQUIRED[p] for p, spec in params.items() if isinstance(spec, dict) and 'default' not in spec}
    if 'actuator' in args: args['actuator'] = ACTUATOR.get(v['name'], SBOM)
    d = view(v['name'], args)
    answers[v['name']] = d
    err = failed(d)
    check(not err, f"L1 {v['name']} answers ({len(rows(d))} rows, {d.get('outcome', '?')})", err or '')

# ---- L2: reconciled against the sources -------------------------------------------------------
print('== L2: figures against the sources read directly')

# Spring Boot's lines and their open-source support end, exactly as spring.io publishes them.
gens = http('https://api.spring.io/projects/spring-boot/generations')['_embedded']['generations']
truth = {g['name']: (g['initialReleaseDate'], g['ossSupportEndDate'], g['commercialSupportEndDate']) for g in gens}
got = {r['line']: (r['released'], r['ossSupportEnds'], r['commercialSupportEnds']) for r in rows(answers['BootLines'])}
expect = dict(sorted(truth.items(), key=lambda kv: kv[1][0], reverse=True)[:40])
check(got == expect, f'L2 BootLines: {len(got)} lines and their dates equal spring.io ({len(expect)})',
      f'missing {sorted(set(expect) - set(got))} extra {sorted(set(got) - set(expect))} '
      f'differ {[k for k in got if k in expect and got[k] != expect[k]]}')

# One exact version's advisories and CVSS, as deps.dev records them.
dd = 'https://api.deps.dev/v3'
ver = http(f'{dd}/systems/maven/packages/{COMPONENT[0]}:{COMPONENT[1]}/versions/{COMPONENT[2]}')
advisories = sorted(a['id'] for a in ver.get('advisoryKeys') or [])
cvss = {a: http(f'{dd}/advisories/{a}').get('cvss3Score') for a in advisories}
check(len(advisories) > 0, f'L2 deps.dev records advisories against {":".join(COMPONENT)} ({len(advisories)})')
sv = answers['ShippedVulnerabilities']
got = {r['advisory']: r['cvss'] for r in rows(sv)}
check(sorted(got) == advisories, 'L2 ShippedVulnerabilities: the advisory ids equal deps.dev',
      f'missing {sorted(set(advisories) - set(got))} extra {sorted(set(got) - set(advisories))}')
check(all(float(got[a] or 0) == float(cvss[a] or 0) for a in got if a in cvss),
      'L2 ShippedVulnerabilities: each CVSS 3 score equals deps.dev', {a: (got[a], cvss.get(a)) for a in got})

# The actuator views, against the JSON they were given.
why = rows(answers['WhyNotApplied'])
check([(r['configuration'], r['condition']) for r in why] == [('RedisAutoConfiguration', 'OnClassCondition')],
      'L2 WhyNotApplied: the one configuration that did not apply, and its condition', why)
beans = {r['bean']: (r['type'], r['scope'], r['dependsOn']) for r in rows(answers['RuntimeBeans'])}
check(beans == {'orderService': ('com.example.OrderService', 'singleton', ['orderRepository']),
                'orderRepository': ('com.example.OrderRepository', 'singleton', [])},
      'L2 RuntimeBeans: both beans, with type, scope and dependencies', beans)
eff = rows(answers['EffectiveSettings'])
won = {r['property']: (r['value'], r['source']) for r in eff}
check(won == {'server.port': ('9090', 'systemProperties')},
      'L2 EffectiveSettings: the property set twice, with the value of the source that wins', won)

# The pinned project, cloned at its commit: its Spring Boot version and its HTTP endpoints.
work = tempfile.mkdtemp()
subprocess.run(['git', 'clone', '-q', REPO, work], check=True)
subprocess.run(['git', '-C', work, 'checkout', '-q', SHA], check=True)
pom = open(os.path.join(work, 'pom.xml')).read()
boot = re.search(r'<parent>.*?<artifactId>spring-boot-starter-parent</artifactId>\s*<version>([^<]+)</version>', pom, re.S).group(1)
card = rows(answers['StackCard'])
check(bool(card) and card[0].get('bootVersion') == boot, f'L2 StackCard: Spring Boot {boot}, as the pom declares',
      card[0].get('bootVersion') if card else 'no row')
endpoints = set()
for path in glob.glob(os.path.join(work, 'src/main/**/*.java'), recursive=True):
    src = open(path).read()
    prefix = re.search(r'^@RequestMapping\("([^"]*)"\)', src, re.M)
    for verb, route in re.findall(r'^\s+@(Get|Post|Put|Delete|Patch)Mapping\(\{?\s*"([^"]*)"', src, re.M):
        endpoints.add((verb.upper(), (prefix.group(1) if prefix else '') + route))
got = {(r['method'], r['route']) for r in rows(answers['Endpoints'])}
check(got == endpoints, f'L2 Endpoints: the {len(endpoints)} mappings the source declares',
      f'missing {sorted(endpoints - got)} extra {sorted(got - endpoints)}')

# The support searches, against the sources' own search for the same words. A search is live, so
# the same query is asked of the source straight after the view; a result that moved between the
# two reads would show as a near-miss, not a wholesale difference.
gh = http('https://api.github.com/search/issues?' + urllib.parse.urlencode(
    {'q': f'{WORDS} org:spring-projects is:issue', 'per_page': 15}), headers={'Accept': 'application/vnd.github+json'})
truth = {i['html_url'] for i in gh['items']}
got = {r['link'] for r in rows(answers['KnownIssues'])}
check(len(got) == len(truth) and len(got & truth) >= len(truth) - 1,
      f'L2 KnownIssues: GitHub\'s own search for the words ({len(truth)} issues)', f'{len(got & truth)} of {len(truth)} shared, view {len(got)}')
se = http('https://api.stackexchange.com/2.3/search/advanced?' + urllib.parse.urlencode(
    {'q': WORDS, 'site': 'stackoverflow', 'tagged': 'spring-boot', 'sort': 'relevance', 'order': 'desc', 'pagesize': 10}))
truth = {q['link'] for q in se['items']}
got = {r['link'] for r in rows(answers['AskedBefore'])}
check(len(got) == len(truth) and len(got & truth) >= len(truth) - 1,
      f'L2 AskedBefore: Stack Overflow\'s own search for the words ({len(truth)} questions)', f'{len(got & truth)} of {len(truth)} shared, view {len(got)}')

# ---- L3: cost ---------------------------------------------------------------------------------
print('== L3: what a question costs')
# One version: one deps.dev call for its advisories, one per advisory for its detail — on the first
# read at most; a second read is served from the cache and asks nobody.
first = calls(sv)
check(first is not None and first <= 1 + len(advisories),
      f'L3 ShippedVulnerabilities on one version: {first} source call(s), ceiling {1 + len(advisories)}')
again = view('ShippedVulnerabilities', {'actuator': SBOM})
check(calls(again) == 0, f'L3 ShippedVulnerabilities again: {calls(again)} source calls (cached)')
for name in ('KnownIssues', 'AskedBefore'):
    c1 = calls(answers[name])
    check(c1 is not None and c1 <= 1, f'L3 {name}: {c1} source call(s), ceiling 1')
    d = view(name, {'words': WORDS})
    check(calls(d) == 0 and len(rows(d)) == len(rows(answers[name])),
          f'L3 {name} again: {calls(d)} source calls, the same {len(rows(d))} rows (kept an hour)')

if fails:
    print(f'{len(fails)} check(s) FAILED')
    sys.exit(1)
print('ALL CHECKS PASS')
