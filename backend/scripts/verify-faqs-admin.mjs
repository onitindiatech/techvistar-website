/**
 * End-to-end verification script for Admin FAQs CMS API.
 * Run: node scripts/verify-faqs-admin.mjs
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

async function main() {
  console.log('\n=== Admin FAQs CMS E2E Verification ===\n');

  if (!(await login())) {
    console.error('Cannot continue without auth.');
    process.exit(1);
  }

  const list1 = await request('/api/faqs/admin?page=1&limit=6');
  const total = list1.json.pagination?.total ?? 0;
  const pageCount = list1.json.data?.length ?? 0;
  log('Pagination (page 1, limit 6)', list1.res.ok && pageCount <= 6 && total >= 5, `returned ${pageCount}, total ${total}`);

  const list2 = await request('/api/faqs/admin?page=2&limit=6');
  log('Pagination (page 2)', list2.res.ok && (list2.json.data?.length ?? 0) >= 0, `returned ${list2.json.data?.length ?? 0}`);

  const search = await request('/api/faqs/admin?search=methodology&limit=100');
  const searchHits = (search.json.data || []).filter((f) => /methodology/i.test(f.question));
  log('Search', search.res.ok && searchHits.length >= 1, `found ${searchHits.length} for "methodology"`);

  const statusActive = await request('/api/faqs/admin?status=active&limit=100');
  const allActive = (statusActive.json.data || []).every((f) => f.status === 'active');
  log('Filter: status=active', statusActive.res.ok && allActive, `count ${statusActive.json.data?.length ?? 0}`);

  const categoryGeneral = await request('/api/faqs/admin?category=General&limit=100');
  const generalHits = (categoryGeneral.json.data || []).filter((f) => f.category === 'General');
  log('Filter: category=General', categoryGeneral.res.ok && generalHits.length >= 1, `count ${generalHits.length}`);

  const pageHome = await request('/api/faqs/admin?pageContext=home&limit=100');
  const homeHits = (pageHome.json.data || []).filter((f) => f.page === 'home');
  log('Filter: pageContext=home', pageHome.res.ok && homeHits.length >= 1, `count ${homeHits.length}`);

  const featured = await request('/api/faqs/admin?featured=true&limit=100');
  const allFeatured = (featured.json.data || []).every((f) => f.featured === true);
  log('Filter: featured=true', featured.res.ok && allFeatured, `count ${featured.json.data?.length ?? 0}`);

  const createPayload = {
    faqId: 'e2e-test-faq',
    question: 'E2E test FAQ question?',
    answer: 'This is an automated end-to-end test FAQ answer for verification.',
    category: 'General',
    page: 'all',
    tags: ['e2e', 'test'],
    featured: false,
    status: 'inactive',
    displayOrder: 99,
    seoTitle: 'E2E FAQ SEO Title',
    seoDescription: 'E2E FAQ SEO description for automated testing.',
  };

  const created = await request('/api/faqs/admin', {
    method: 'POST',
    body: JSON.stringify(createPayload),
  });
  const createdId = created.json.data?._id;
  log('Create', created.res.status === 201 && !!createdId, `id=${createdId}`);
  log('Create audit fields', !!created.json.data?.createdBy, `createdBy=${created.json.data?.createdBy}`);

  const dup = await request('/api/faqs/admin', {
    method: 'POST',
    body: JSON.stringify({ ...createPayload, question: 'Duplicate FAQ ID test?' }),
  });
  log('Duplicate faqId protection', dup.res.status === 409, `status ${dup.res.status}`);

  const updated = await request(`/api/faqs/admin/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify({ question: 'E2E test FAQ question updated?', status: 'active' }),
  });
  log('Partial update', updated.res.ok && updated.json.data?.question?.includes('updated'), updated.json.data?.question);
  log('Status toggle (inactive→active)', updated.json.data?.status === 'active', `status=${updated.json.data?.status}`);

  const publicList = await request('/api/faqs');
  const inPublic = (publicList.json.data || []).some((f) => f.faqId === 'e2e-test-faq');
  log('Public list includes active FAQ', publicList.res.ok && inPublic, `inPublic=${inPublic}`);

  const softDel = await request(`/api/faqs/admin/${createdId}`, { method: 'DELETE' });
  log('Soft delete', softDel.res.ok, `status ${softDel.res.status}`);

  const trashList = await request('/api/faqs/admin?trash=true&limit=100');
  const inTrash = (trashList.json.data || []).some((f) => f._id === createdId && f.isDeleted === true);
  log('Trash filter shows deleted item', trashList.res.ok && inTrash, `inTrash=${inTrash}`);

  const publicAfterDelete = await request('/api/faqs');
  const stillInPublic = (publicAfterDelete.json.data || []).some((f) => f.faqId === 'e2e-test-faq');
  log('Public hidden after soft delete', publicAfterDelete.res.ok && !stillInPublic, `stillInPublic=${stillInPublic}`);

  const restored = await request(`/api/faqs/admin/${createdId}/restore`, { method: 'POST' });
  log('Restore', restored.res.ok, `status ${restored.res.status}`);

  const afterRestore = await request('/api/faqs');
  const visibleAgain = (afterRestore.json.data || []).some((f) => f.faqId === 'e2e-test-faq');
  log('Public visible after restore', afterRestore.res.ok && visibleAgain, `visibleAgain=${visibleAgain}`);

  const hideAlias = await request(`/api/faqs/admin/${createdId}/hide`, { method: 'PATCH' });
  log('Hide alias (status inactive)', hideAlias.res.ok && hideAlias.json.data?.status === 'inactive', `status=${hideAlias.json.data?.status}`);

  await request(`/api/faqs/admin/${createdId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: 'active' }),
  });

  const bulkStatus = await request('/api/faqs/admin/bulk-status', {
    method: 'POST',
    body: JSON.stringify({ ids: [createdId], status: 'inactive' }),
  });
  const afterBulk = await request('/api/faqs/admin?search=e2e-test-faq&limit=10');
  const bulkItem = (afterBulk.json.data || []).find((f) => f._id === createdId);
  log('Bulk status update', bulkStatus.res.ok && bulkItem?.status === 'inactive', `status=${bulkItem?.status}`);

  const permDel = await request(`/api/faqs/admin/${createdId}/permanent`, { method: 'DELETE' });
  log('Permanent delete', permDel.res.ok, `status ${permDel.res.status}`);

  const gone = await request('/api/faqs/admin?search=e2e-test-faq&limit=10');
  const stillExists = (gone.json.data || []).some((f) => f._id === createdId);
  log('Gone after permanent delete', gone.res.ok && !stillExists, `stillExists=${stillExists}`);

  const dashboardCount = await request('/api/faqs/admin?page=1&limit=1');
  const cmsTotal = dashboardCount.json.pagination?.total ?? 0;
  log('Admin total count (dashboard-style)', dashboardCount.res.ok && cmsTotal >= 5, `total=${cmsTotal}`);

  const unauth = await fetch(`${BASE}/api/faqs/admin?page=1&limit=1`);
  log('Auth required for admin list', unauth.status === 401, `status ${unauth.status}`);

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
