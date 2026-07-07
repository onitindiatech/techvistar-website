/**
 * End-to-end verification script for Admin Portfolio CMS API.
 * Run: node scripts/verify-portfolio-admin.mjs
 */

const BASE = process.env.API_BASE || 'http://localhost:5000';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@techvistar.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';

const results = [];

function log(name, pass, detail = '') {
  results.push({ name, pass, detail });
  const icon = pass ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${name}${detail ? ` — ${detail}` : ''}`);
}

let cookie = '';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (cookie) headers.Cookie = cookie;
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = { raw: text }; }
  return { res, json };
}

async function login() {
  const { res, json } = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  log('Admin Login', res.ok && json.success, `status ${res.status}`);
  return res.ok;
}

/** Remove leftover e2e records so the script is idempotent across interrupted runs. */
async function cleanupE2E() {
  for (const trash of ['false', 'true']) {
    const { json } = await request(`/api/portfolio/admin?search=e2e-test-portfolio&limit=100&trash=${trash}`);
    for (const item of json.data || []) {
      if (item.slug === 'e2e-test-portfolio-project' && item._id) {
        await request(`/api/portfolio/admin/${item._id}/permanent`, { method: 'DELETE' });
      }
    }
  }
}

const basePayload = {
  title: 'E2E Test Portfolio Project',
  slug: 'e2e-test-portfolio-project',
  description: 'Short description for automated e2e portfolio verification.',
  thumbnail: 'https://placehold.co/600x400/png',
  category: 'FinTech',
  technologies: ['TypeScript', 'React'],
  liveUrl: '#',
  githubUrl: '#',
  featured: false,
  date: '2026-01-01',
  client: 'E2E Client',
  role: 'Lead Developer',
  longDescription: 'Long description for automated e2e portfolio verification with sufficient detail.',
  keyFeatures: ['Feature A', 'Feature B'],
  challenges: ['Challenge A'],
  gallery: [],
  tags: ['e2e', 'test'],
  status: 'In Progress',
  serviceSlugs: [],
  industry: 'Technology',
  updatedDate: '2026-01-01',
  displayOrder: 99,
};

async function main() {
  console.log('\n=== Admin Portfolio CMS E2E Verification ===\n');

  if (!(await login())) {
    console.error('Cannot continue without auth.');
    process.exit(1);
  }

  await cleanupE2E();

  const list1 = await request('/api/portfolio/admin?page=1&limit=6');
  const total = list1.json.pagination?.total ?? 0;
  const pageCount = list1.json.data?.length ?? 0;
  log('Pagination (page 1, limit 6)', list1.res.ok && pageCount <= 6 && total >= 5, `returned ${pageCount}, total ${total}`);

  const list2 = await request('/api/portfolio/admin?page=2&limit=6');
  log('Pagination (page 2)', list2.res.ok && (list2.json.data?.length ?? 0) > 0, `returned ${list2.json.data?.length ?? 0}`);

  const search = await request('/api/portfolio/admin?search=navigation&limit=100');
  const searchHits = (search.json.data || []).filter((p) => p.slug === 'navigation-route-optimization');
  log('Search', search.res.ok && searchHits.length >= 1, `found ${searchHits.length} for "navigation"`);

  const statusCompleted = await request('/api/portfolio/admin?status=Completed&limit=100');
  const allCompleted = (statusCompleted.json.data || []).every((p) => p.status === 'Completed');
  log('Filter: status=Completed', statusCompleted.res.ok && allCompleted, `count ${statusCompleted.json.data?.length ?? 0}`);

  const categoryFin = await request('/api/portfolio/admin?category=FinTech&limit=100');
  const finHits = (categoryFin.json.data || []).filter((p) => p.category === 'FinTech');
  log('Filter: category=FinTech', categoryFin.res.ok && finHits.length >= 1, `count ${finHits.length}`);

  const featured = await request('/api/portfolio/admin?featured=true&limit=100');
  const allFeatured = (featured.json.data || []).every((p) => p.featured === true);
  log('Filter: featured=true', featured.res.ok && allFeatured, `count ${featured.json.data?.length ?? 0}`);

  const created = await request('/api/portfolio/admin', {
    method: 'POST',
    body: JSON.stringify(basePayload),
  });
  const createdId = created.json.data?._id;
  log('Create', created.res.status === 201 && !!createdId, `id=${createdId}`);

  const dup = await request('/api/portfolio/admin', {
    method: 'POST',
    body: JSON.stringify({ ...basePayload, title: 'Duplicate Slug Test' }),
  });
  log('Duplicate slug protection', dup.res.status === 409, `status ${dup.res.status}`);

  const updated = await request(`/api/portfolio/admin/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify({ ...basePayload, title: 'E2E Test Portfolio Updated', status: 'Completed' }),
  });
  log('Edit', updated.res.ok && updated.json.data?.title === 'E2E Test Portfolio Updated', updated.json.data?.title);
  log('Status toggle (In Progress→Completed)', updated.json.data?.status === 'Completed', `status=${updated.json.data?.status}`);

  const publicGet = await request('/api/portfolio/e2e-test-portfolio-project');
  log('Public GET after update', publicGet.res.ok && publicGet.json.data?.slug === 'e2e-test-portfolio-project', `status ${publicGet.res.status}`);

  const publicList = await request('/api/portfolio');
  const inPublicList = (publicList.json.data || []).some((p) => p.slug === 'e2e-test-portfolio-project');
  log('Public list includes new project', publicList.res.ok && inPublicList, `inList=${inPublicList}`);

  const partialEdit = await request(`/api/portfolio/admin/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify({ description: 'Partial update description only' }),
  });
  log('Partial edit preserves title', partialEdit.res.ok && partialEdit.json.data?.title === 'E2E Test Portfolio Updated', partialEdit.json.data?.title);

  const softDel = await request(`/api/portfolio/admin/${createdId}`, { method: 'DELETE' });
  log('Soft delete', softDel.res.ok, `status ${softDel.res.status}`);

  const trashList = await request('/api/portfolio/admin?trash=true&limit=100');
  const inTrash = (trashList.json.data || []).some((p) => p._id === createdId && p.isDeleted === true);
  log('Trash filter shows deleted item', trashList.res.ok && inTrash, `inTrash=${inTrash}`);

  const publicAfterDelete = await request('/api/portfolio/e2e-test-portfolio-project');
  log('Public hidden after soft delete', publicAfterDelete.res.status === 404, `status ${publicAfterDelete.res.status}`);

  const restored = await request(`/api/portfolio/admin/${createdId}/restore`, { method: 'POST' });
  log('Restore', restored.res.ok, `status ${restored.res.status}`);

  const afterRestore = await request('/api/portfolio/e2e-test-portfolio-project');
  log('Public visible after restore', afterRestore.res.ok, `status ${afterRestore.res.status}`);

  const bulkStatus = await request('/api/portfolio/admin/bulk-status', {
    method: 'POST',
    body: JSON.stringify({ ids: [createdId], status: 'Coming Soon' }),
  });
  const afterBulk = await request('/api/portfolio/admin?search=e2e-test-portfolio&limit=10');
  const bulkItem = (afterBulk.json.data || []).find((p) => p._id === createdId);
  log('Bulk status update', bulkStatus.res.ok && bulkItem?.status === 'Coming Soon', `status=${bulkItem?.status}`);

  const permDel = await request(`/api/portfolio/admin/${createdId}/permanent`, { method: 'DELETE' });
  log('Permanent delete', permDel.res.ok, `status ${permDel.res.status}`);

  const gone = await request('/api/portfolio/admin?search=e2e-test-portfolio&limit=10');
  const stillExists = (gone.json.data || []).some((p) => p._id === createdId);
  log('Gone after permanent delete', gone.res.ok && !stillExists, `stillExists=${stillExists}`);

  const publicCount = await request('/api/portfolio');
  const activeCount = (publicCount.json.data || []).length;
  log('Public list supports variable count', publicCount.res.ok && activeCount >= 5, `count=${activeCount}`);

  const unauth = await fetch(`${BASE}/api/portfolio/admin`);
  log('Admin requires auth', unauth.status === 401, `status ${unauth.status}`);

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
