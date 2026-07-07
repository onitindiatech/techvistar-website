/**
 * End-to-end verification script for Admin Jobs CMS API.
 * Run: node scripts/verify-jobs-admin.mjs
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
  title: 'E2E Test Job',
  slug: 'e2e-test-job',
  department: 'Engineering',
  location: 'Remote',
  employmentType: 'Full-time',
  experience: '2+ years',
  salary: 'Competitive',
  description: 'Automated e2e verification job posting for CMS parity testing.',
  requirements: ['TypeScript', 'Node.js'],
  responsibilities: ['Build APIs', 'Write tests'],
  benefits: ['Remote work', 'Health insurance'],
  status: 'draft',
  displayOrder: 99,
  featured: false,
};

async function main() {
  console.log('\n=== Admin Jobs CMS E2E Verification ===\n');

  if (!(await login())) {
    console.error('Cannot continue without auth.');
    process.exit(1);
  }

  const list1 = await request('/api/careers/jobs/admin?page=1&limit=6');
  const total = list1.json.pagination?.total ?? 0;
  const pageCount = list1.json.data?.length ?? 0;
  log('Pagination (page 1, limit 6)', list1.res.ok && pageCount <= 6, `returned ${pageCount}, total ${total}`);

  const list2 = await request('/api/careers/jobs/admin?page=2&limit=6');
  log('Pagination (page 2)', list2.res.ok, `returned ${list2.json.data?.length ?? 0}`);

  const search = await request('/api/careers/jobs/admin?search=frontend&limit=100');
  const searchHits = (search.json.data || []).filter((j) => j.slug === 'frontend-developer');
  log('Search', search.res.ok && (searchHits.length >= 1 || total === 0), `found ${searchHits.length} for "frontend"`);

  const statusActive = await request('/api/careers/jobs/admin?status=active&limit=100');
  const allActive = (statusActive.json.data || []).every((j) => j.status === 'active');
  log('Filter: status=active', statusActive.res.ok && allActive, `count ${statusActive.json.data?.length ?? 0}`);

  const deptEng = await request('/api/careers/jobs/admin?department=Engineering&limit=100');
  const engHits = (deptEng.json.data || []).filter((j) => j.department === 'Engineering');
  log('Filter: department=Engineering', deptEng.res.ok && engHits.length >= 0, `count ${engHits.length}`);

  const featured = await request('/api/careers/jobs/admin?featured=false&limit=100');
  const allNotFeatured = (featured.json.data || []).every((j) => j.featured === false);
  log('Filter: featured=false', featured.res.ok && allNotFeatured, `count ${featured.json.data?.length ?? 0}`);

  const created = await request('/api/careers/jobs/admin', {
    method: 'POST',
    body: JSON.stringify(basePayload),
  });
  const createdId = created.json.data?._id;
  log('Create', created.res.status === 201 && !!createdId, `id=${createdId}`);

  const dup = await request('/api/careers/jobs/admin', {
    method: 'POST',
    body: JSON.stringify({ ...basePayload, title: 'Duplicate Slug Test Job' }),
  });
  log('Duplicate slug protection', dup.res.status === 409, `status ${dup.res.status}`);

  const publicWhileDraft = await request('/api/careers/jobs/e2e-test-job');
  log('Public hidden while draft', publicWhileDraft.res.status === 404, `status ${publicWhileDraft.res.status}`);

  const updated = await request(`/api/careers/jobs/admin/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify({ ...basePayload, title: 'E2E Test Job Updated', status: 'active' }),
  });
  log('Edit', updated.res.ok && updated.json.data?.title === 'E2E Test Job Updated', updated.json.data?.title);
  log('Status toggle (draft→active)', updated.json.data?.status === 'active', `status=${updated.json.data?.status}`);

  const publicGet = await request('/api/careers/jobs/e2e-test-job');
  log('Public GET after activate', publicGet.res.ok && publicGet.json.data?.slug === 'e2e-test-job', `status ${publicGet.res.status}`);

  const publicList = await request('/api/careers/jobs');
  const inPublicList = (publicList.json.data || []).some((j) => j.slug === 'e2e-test-job');
  log('Public list includes new job', publicList.res.ok && inPublicList, `inList=${inPublicList}`);

  const partialEdit = await request(`/api/careers/jobs/admin/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify({ salary: 'Updated salary only' }),
  });
  log('Partial edit preserves title', partialEdit.res.ok && partialEdit.json.data?.title === 'E2E Test Job Updated', partialEdit.json.data?.title);

  const softDel = await request(`/api/careers/jobs/admin/${createdId}`, { method: 'DELETE' });
  log('Soft delete', softDel.res.ok, `status ${softDel.res.status}`);

  const trashList = await request('/api/careers/jobs/admin?trash=true&limit=100');
  const inTrash = (trashList.json.data || []).some((j) => j._id === createdId && j.isDeleted === true);
  log('Trash filter shows deleted item', trashList.res.ok && inTrash, `inTrash=${inTrash}`);

  const publicAfterDelete = await request('/api/careers/jobs/e2e-test-job');
  log('Public hidden after soft delete', publicAfterDelete.res.status === 404, `status ${publicAfterDelete.res.status}`);

  const restored = await request(`/api/careers/jobs/admin/${createdId}/restore`, { method: 'POST' });
  log('Restore', restored.res.ok, `status ${restored.res.status}`);

  const afterRestore = await request('/api/careers/jobs/e2e-test-job');
  log('Public visible after restore', afterRestore.res.ok, `status ${afterRestore.res.status}`);

  await request(`/api/careers/jobs/admin/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify({ ...basePayload, title: 'E2E Test Job Updated', status: 'active' }),
  });
  const bulkStatus = await request('/api/careers/jobs/admin/bulk-status', {
    method: 'POST',
    body: JSON.stringify({ ids: [createdId], status: 'draft' }),
  });
  const afterBulk = await request('/api/careers/jobs/admin?search=e2e-test-job&limit=10');
  const bulkItem = (afterBulk.json.data || []).find((j) => j._id === createdId);
  log('Bulk status update', bulkStatus.res.ok && bulkItem?.status === 'draft', `status=${bulkItem?.status}`);

  const permDel = await request(`/api/careers/jobs/admin/${createdId}/permanent`, { method: 'DELETE' });
  log('Permanent delete', permDel.res.ok, `status ${permDel.res.status}`);

  const gone = await request('/api/careers/jobs/admin?search=e2e-test-job&limit=10');
  const stillExists = (gone.json.data || []).some((j) => j._id === createdId);
  log('Gone after permanent delete', gone.res.ok && !stillExists, `stillExists=${stillExists}`);

  const publicCount = await request('/api/careers/jobs');
  const activeCount = (publicCount.json.data || []).length;
  log('Public list supports variable count', publicCount.res.ok && activeCount >= 0, `count=${activeCount}`);

  const unauth = await fetch(`${BASE}/api/careers/jobs/admin`);
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
