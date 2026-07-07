/**
 * End-to-end verification script for Admin Solutions CMS API.
 * Run: node scripts/verify-solutions-admin.mjs
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

const basePayload = {
  title: 'E2E Test Solution',
  slug: 'e2e-test-solution',
  subtitle: 'Subtitle for automated e2e verification.',
  icon: 'Brain',
  category: 'Business Solutions',
  status: 'draft',
  displayOrder: 99,
  featured: false,
  techStack: ['TypeScript', 'Node.js'],
  challenges: {
    title: 'Operational bottlenecks',
    points: ['Manual workflows', 'Data silos'],
    impact: 'Reduced throughput and visibility',
  },
  ourSolution: {
    overview: 'Integrated platform for e2e test verification.',
    capabilities: ['Automation', 'Reporting'],
  },
  benefits: {
    roi: 'Measurable ROI within quarters',
    efficiency: 'Higher team efficiency',
    scalability: 'Cloud-ready architecture',
    security: 'Enterprise-grade security controls',
  },
};

async function main() {
  console.log('\n=== Admin Solutions CMS E2E Verification ===\n');

  if (!(await login())) {
    console.error('Cannot continue without auth.');
    process.exit(1);
  }

  const list1 = await request('/api/solutions/admin?page=1&limit=6');
  const total = list1.json.pagination?.total ?? 0;
  const pageCount = list1.json.data?.length ?? 0;
  log('Pagination (page 1, limit 6)', list1.res.ok && pageCount <= 6 && total >= 5, `returned ${pageCount}, total ${total}`);

  const list2 = await request('/api/solutions/admin?page=2&limit=6');
  log('Pagination (page 2)', list2.res.ok && (list2.json.data?.length ?? 0) > 0, `returned ${list2.json.data?.length ?? 0}`);

  const search = await request('/api/solutions/admin?search=enterprise&limit=100');
  const searchHits = (search.json.data || []).filter((s) => s.slug === 'enterprise-software');
  log('Search', search.res.ok && searchHits.length === 1, `found ${searchHits.length} for "enterprise"`);

  const statusActive = await request('/api/solutions/admin?status=active&limit=100');
  const allActive = (statusActive.json.data || []).every((s) => s.status === 'active');
  log('Filter: status=active', statusActive.res.ok && allActive, `count ${statusActive.json.data?.length ?? 0}`);

  const categoryBiz = await request('/api/solutions/admin?category=Business%20Solutions&limit=100');
  const bizHits = (categoryBiz.json.data || []).filter((s) => s.category === 'Business Solutions');
  log('Filter: category=Business Solutions', categoryBiz.res.ok && bizHits.length >= 1, `count ${bizHits.length}`);

  const featured = await request('/api/solutions/admin?featured=false&limit=100');
  const allNotFeatured = (featured.json.data || []).every((s) => s.featured === false);
  log('Filter: featured=false', featured.res.ok && allNotFeatured, `count ${featured.json.data?.length ?? 0}`);

  const created = await request('/api/solutions/admin', {
    method: 'POST',
    body: JSON.stringify(basePayload),
  });
  const createdId = created.json.data?._id;
  log('Create', created.res.status === 201 && !!createdId, `id=${createdId}`);

  const dup = await request('/api/solutions/admin', {
    method: 'POST',
    body: JSON.stringify({ ...basePayload, title: 'Duplicate Slug Test' }),
  });
  log('Duplicate slug protection', dup.res.status === 409, `status ${dup.res.status}`);

  const publicWhileDraft = await request('/api/solutions/e2e-test-solution');
  log('Public hidden while draft', publicWhileDraft.res.status === 404, `status ${publicWhileDraft.res.status}`);

  const updated = await request(`/api/solutions/admin/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify({ ...basePayload, title: 'E2E Test Solution Updated', status: 'active' }),
  });
  log('Edit', updated.res.ok && updated.json.data?.title === 'E2E Test Solution Updated', updated.json.data?.title);
  log('Status toggle (draft→active)', updated.json.data?.status === 'active', `status=${updated.json.data?.status}`);

  const publicGet = await request('/api/solutions/e2e-test-solution');
  log('Public GET after activate', publicGet.res.ok && publicGet.json.data?.slug === 'e2e-test-solution', `status ${publicGet.res.status}`);

  const publicList = await request('/api/solutions');
  const inPublicList = (publicList.json.data || []).some((s) => s.slug === 'e2e-test-solution');
  log('Public list includes new solution', publicList.res.ok && inPublicList, `inList=${inPublicList}`);

  const partialEdit = await request(`/api/solutions/admin/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify({ subtitle: 'Partial update subtitle only' }),
  });
  log('Partial edit preserves title', partialEdit.res.ok && partialEdit.json.data?.title === 'E2E Test Solution Updated', partialEdit.json.data?.title);

  const softDel = await request(`/api/solutions/admin/${createdId}`, { method: 'DELETE' });
  log('Soft delete', softDel.res.ok, `status ${softDel.res.status}`);

  const trashList = await request('/api/solutions/admin?trash=true&limit=100');
  const inTrash = (trashList.json.data || []).some((s) => s._id === createdId && s.isDeleted === true);
  log('Trash filter shows deleted item', trashList.res.ok && inTrash, `inTrash=${inTrash}`);

  const publicAfterDelete = await request('/api/solutions/e2e-test-solution');
  log('Public hidden after soft delete', publicAfterDelete.res.status === 404, `status ${publicAfterDelete.res.status}`);

  const restored = await request(`/api/solutions/admin/${createdId}/restore`, { method: 'POST' });
  log('Restore', restored.res.ok, `status ${restored.res.status}`);

  const afterRestore = await request('/api/solutions/e2e-test-solution');
  log('Public visible after restore', afterRestore.res.ok, `status ${afterRestore.res.status}`);

  await request(`/api/solutions/admin/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify({ ...basePayload, title: 'E2E Test Solution Updated', status: 'active' }),
  });
  const bulkStatus = await request('/api/solutions/admin/bulk-status', {
    method: 'POST',
    body: JSON.stringify({ ids: [createdId], status: 'draft' }),
  });
  const afterBulk = await request('/api/solutions/admin?search=e2e-test-solution&limit=10');
  const bulkItem = (afterBulk.json.data || []).find((s) => s._id === createdId);
  log('Bulk status update', bulkStatus.res.ok && bulkItem?.status === 'draft', `status=${bulkItem?.status}`);

  const permDel = await request(`/api/solutions/admin/${createdId}/permanent`, { method: 'DELETE' });
  log('Permanent delete', permDel.res.ok, `status ${permDel.res.status}`);

  const gone = await request('/api/solutions/admin?search=e2e-test-solution&limit=10');
  const stillExists = (gone.json.data || []).some((s) => s._id === createdId);
  log('Gone after permanent delete', gone.res.ok && !stillExists, `stillExists=${stillExists}`);

  const publicCount = await request('/api/solutions');
  const activeCount = (publicCount.json.data || []).length;
  log('Public list supports variable count', publicCount.res.ok && activeCount >= 5, `count=${activeCount}`);

  const unauth = await fetch(`${BASE}/api/solutions/admin`);
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
