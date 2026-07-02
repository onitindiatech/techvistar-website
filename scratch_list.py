import re
with open('frontend/src/data/services.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Split by the '{' that contains 'slug:'
objects = re.split(r'\{\s*(?:id|slug)', content)
print(f"Total objects found: {len(objects) - 1}")
for obj in objects[1:]:
    slug_m = re.search(r"slug:\s*'([^']+)'", obj)
    title_m = re.search(r"title:\s*'([^']+)'", obj)
    if slug_m and title_m:
        print(f"Slug: {slug_m.group(1)} | Title: {title_m.group(1)}")
