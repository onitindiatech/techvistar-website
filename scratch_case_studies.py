import re
with open('frontend/src/data/services.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Let's find all occurrences of caseStudies
matches = re.finditer(r"slug:\s*'([^']+)'.*?caseStudies:\s*\[(.*?)\]", content, re.DOTALL)
for m in matches:
    slug = m.group(1)
    studies = m.group(2).strip()
    print(f"Slug: {slug} | caseStudies: {studies}")
