"""Regenerates the Stack Report's "How it works" section from the realm's own views, so the Cypher it
shows is the Cypher that runs. Run after changing a view: python3 tools/how-it-works.py"""
import html, os, re, yaml

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
APP = os.path.join(ROOT, "apps", "stack.html")
views = {}
# This realm's views, and realm-java-project's (a sibling checkout), which the app also runs.
for d in (os.path.join(ROOT, "views"), os.path.join(os.path.dirname(ROOT), "realm-java-project", "views")):
    for f in sorted(os.listdir(d)) if os.path.isdir(d) else []:
        for v in yaml.safe_load(open(os.path.join(d, f))) if f.endswith(".yml") else []:
            views[v["name"]] = v
page = open(APP).read()
used = re.search(r'"views":\[([^\]]*)\]', page).group(1).replace('"', '').split(',')
parts = [f'<details><summary><b>{n}</b> — {html.escape(" ".join(views[n]["description"].split()))}</summary>'
         f'<pre class="mono">{html.escape(views[n]["cypher"].rstrip())}</pre></details>' for n in used]
start = page.index('  <h3>Every view, with the Cypher that runs</h3>\n') + len('  <h3>Every view, with the Cypher that runs</h3>\n')
end = page.index('  <h3>What an empty panel means</h3>')
page = page[:start] + '  ' + '\n  '.join(parts) + '\n' + page[end:]
open(APP, "w").write(page)
print(f"{len(parts)} views written into {APP}")
