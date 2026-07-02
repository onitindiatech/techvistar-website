import re
with open('frontend/src/data/services.ts', 'r', encoding='utf-8') as f:
    content = f.read()
lines = content.split('\n')
slug = None
for i, line in enumerate(lines):
    m = re.search(r"slug:\s*'([^']+)'", line)
    if m:
        slug = m.group(1)
    if 'dashboardImage' in line and slug:
        print(f"{slug} -> {line.strip()}")
