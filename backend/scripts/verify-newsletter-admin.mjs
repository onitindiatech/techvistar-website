/**
 * End-to-end verification script for Admin Newsletter API.
 * Run: node scripts/verify-newsletter-admin.mjs
 */

const BASE = process.env.API_BASE || 'http://localhost:5000';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@techvistar.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';

const results = [];
const testEmail = `e2e-newsletter-${Date.now()}@test.com`;

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
  console.log('\n=== Admin Newsletter E2E Verification ===\n');

  const unauth = await request('/api/newsletter/admin?page=1&limit=1');
  log('Unauthenticated admin blocked', unauth.res.status === 401, `status ${unauth.res.status}`);

  if (!(await login())) {
    console.error('Cannot continue without auth.');
    process.exit(1);
  }

  const list1 = await request('/api/newsletter/admin?page=1&limit=6');
  const total = list1.json.pagination?.total ?? 0;
  log('Pagination (page 1, limit 6)', list1.res.ok && (list1.json.data?.length ?? 0) <= 6, `returned ${list1.json.data?.length ?? 0}, total ${total}`);

  const search = await request('/api/newsletter/admin?search=@&limit=10');
  log('Search', search.res.ok, `count ${search.json.data?.length ?? 0}`);

  const statusSub = await request('/api/newsletter/admin?status=subscribed&limit=100');
  const allSub = (statusSub.json.data || []).every((s) => s.status === 'subscribed');
  log('Filter: status=subscribed', statusSub.res.ok && allSub, `count ${statusSub.json.data?.length ?? 0}`);

  const sourceFooter = await request('/api/newsletter/admin?source=footer&limit=100');
  log('Filter: source=footer', sourceFooter.res.ok, `count ${sourceFooter.json.data?.length ?? 0}`);

  const created = await request('/api/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email: testEmail, source: 'footer' }),
  });
  const createdId = created.json.data?._id;
  log('Public subscribe', created.res.status === 201 && !!createdId, `id=${createdId}`);

  const statusUpdate = await request(`/api/newsletter/admin/${createdId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'unsubscribed' }),
  });
  log('Status update (subscribed→unsubscribed)', statusUpdate.res.ok && statusUpdate.json.data?.status === 'unsubscribed', `status=${statusUpdate.json.data?.status}`);

  const softDel = await request(`/api/newsletter/admin/${createdId}`, { method: 'DELETE' });
  log('Soft delete', softDel.res.ok, `status ${softDel.res.status}`);

  const trashList = await request('/api/newsletter/admin?trash=true&limit=100');
  const inTrash = (trashList.json.data || []).some((s) => s._id === createdId && s.isDeleted === true);
  log('Trash filter shows deleted item', trashList.res.ok && inTrash, `inTrash=${inTrash}`);

  const restored = await request(`/api/newsletter/admin/${createdId}/restore`, { method: 'POST' });
  log('Restore', restored.res.ok, `status ${restored.res.status}`);

  const bulkStatus = await request('/api/newsletter/admin/bulk-status', {
    method: 'POST',
    body: JSON.stringify({ ids: [createdId], status: 'subscribed' }),
  });
  const afterBulk = await request(`/api/newsletter/admin?search=${encodeURIComponent(testEmail)}&limit=10`);
  const bulkItem = (afterBulk.json.data || []).find((s) => s._id === createdId);
  log('Bulk status update', bulkStatus.res.ok && bulkItem?.status === 'subscribed', `status=${bulkItem?.status}`);

  const permDel = await request(`/api/newsletter/admin/${createdId}/permanent`, { method: 'DELETE' });
  log('Permanent delete', permDel.res.ok, `status ${permDel.res.status}`);

  const gone = await request(`/api/newsletter/admin?search=${encodeURIComponent(testEmail)}&limit=10`);
  const stillExists = (gone.json.data || []).some((s) => s._id === createdId);
  log('Gone after permanent delete', gone.res.ok && !stillExists, `stillExists=${stillExists}`);

  const dashboardCount = await request('/api/newsletter/admin?page=1&limit=1');
  const cmsTotal = dashboardCount.json.pagination?.total ?? 0;
  log('Admin total count (dashboard-style)', dashboardCount.res.ok && cmsTotal >= 0, `total=${cmsTotal}`);

  const passed = results.filter((r) => r.pass).length;
  const failed = results.filter((r) => !r.pass).length;
  console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===\n`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
