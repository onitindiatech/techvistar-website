/**
 * End-to-end verification script for Admin Contacts API.
 * Run: node scripts/verify-contacts-admin.mjs
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

const contactPayload = {
  name: 'E2E Contact Test',
  email: `e2e-contact-${Date.now()}@test.com`,
  phone: '+1-555-0100',
  company: 'E2E Corp',
  serviceInterested: 'web-development',
  budget: '$10k-$25k',
  message: 'This is an automated end-to-end contact inquiry test message for admin verification.',
};

async function main() {
  console.log('\n=== Admin Contacts E2E Verification ===\n');

  const unauth = await request('/api/contact/admin?page=1&limit=1');
  log('Unauthenticated admin blocked', unauth.res.status === 401, `status ${unauth.res.status}`);

  if (!(await login())) {
    console.error('Cannot continue without auth.');
    process.exit(1);
  }

  const list1 = await request('/api/contact/admin?page=1&limit=6');
  const total = list1.json.pagination?.total ?? 0;
  log('Pagination (page 1, limit 6)', list1.res.ok && (list1.json.data?.length ?? 0) <= 6, `returned ${list1.json.data?.length ?? 0}, total ${total}`);

  const search = await request('/api/contact/admin?search=E2E&limit=10');
  log('Search', search.res.ok, `count ${search.json.data?.length ?? 0}`);

  const statusNew = await request('/api/contact/admin?status=new&limit=100');
  const allNew = (statusNew.json.data || []).every((c) => c.status === 'new');
  log('Filter: status=new', statusNew.res.ok && allNew, `count ${statusNew.json.data?.length ?? 0}`);

  const created = await request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(contactPayload),
  });
  const createdId = created.json.data?._id;
  log('Public create contact', created.res.status === 201 && !!createdId, `id=${createdId}`);

  const statusUpdate = await request(`/api/contact/admin/${createdId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'in-progress' }),
  });
  log('Status update (new→in-progress)', statusUpdate.res.ok && statusUpdate.json.data?.status === 'in-progress', `status=${statusUpdate.json.data?.status}`);

  const softDel = await request(`/api/contact/admin/${createdId}`, { method: 'DELETE' });
  log('Soft delete', softDel.res.ok, `status ${softDel.res.status}`);

  const trashList = await request('/api/contact/admin?trash=true&limit=100');
  const inTrash = (trashList.json.data || []).some((c) => c._id === createdId && c.isDeleted === true);
  log('Trash filter shows deleted item', trashList.res.ok && inTrash, `inTrash=${inTrash}`);

  const restored = await request(`/api/contact/admin/${createdId}/restore`, { method: 'POST' });
  log('Restore', restored.res.ok, `status ${restored.res.status}`);

  const bulkStatus = await request('/api/contact/admin/bulk-status', {
    method: 'POST',
    body: JSON.stringify({ ids: [createdId], status: 'resolved' }),
  });
  const afterBulk = await request(`/api/contact/admin?search=${encodeURIComponent(contactPayload.email)}&limit=10`);
  const bulkItem = (afterBulk.json.data || []).find((c) => c._id === createdId);
  log('Bulk status update', bulkStatus.res.ok && bulkItem?.status === 'resolved', `status=${bulkItem?.status}`);

  const permDel = await request(`/api/contact/admin/${createdId}/permanent`, { method: 'DELETE' });
  log('Permanent delete', permDel.res.ok, `status ${permDel.res.status}`);

  const gone = await request(`/api/contact/admin?search=${encodeURIComponent(contactPayload.email)}&limit=10`);
  const stillExists = (gone.json.data || []).some((c) => c._id === createdId);
  log('Gone after permanent delete', gone.res.ok && !stillExists, `stillExists=${stillExists}`);

  const dashboardCount = await request('/api/contact/admin?page=1&limit=1');
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
