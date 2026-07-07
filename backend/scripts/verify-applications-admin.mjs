/**
 * End-to-end verification script for Admin Job Applications API.
 * Run: node scripts/verify-applications-admin.mjs
 */

const BASE = process.env.API_BASE || 'http://localhost:5000';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@techvistar.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';

const results = [];
const testEmail = `e2e-applicant-${Date.now()}@test.com`;

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
  console.log('\n=== Admin Job Applications E2E Verification ===\n');

  const unauth = await request('/api/careers/apply/admin?page=1&limit=1');
  log('Unauthenticated admin blocked', unauth.res.status === 401, `status ${unauth.res.status}`);

  if (!(await login())) {
    console.error('Cannot continue without auth.');
    process.exit(1);
  }

  const list1 = await request('/api/careers/apply/admin?page=1&limit=6');
  const total = list1.json.pagination?.total ?? 0;
  log('Pagination (page 1, limit 6)', list1.res.ok && (list1.json.data?.length ?? 0) <= 6, `returned ${list1.json.data?.length ?? 0}, total ${total}`);

  const search = await request('/api/careers/apply/admin?search=test&limit=10');
  log('Search', search.res.ok, `count ${search.json.data?.length ?? 0}`);

  const statusPending = await request('/api/careers/apply/admin?status=Pending&limit=100');
  const allPending = (statusPending.json.data || []).every((a) => a.status === 'Pending');
  log('Filter: status=Pending', statusPending.res.ok && allPending, `count ${statusPending.json.data?.length ?? 0}`);

  const jobsList = await request('/api/careers/jobs/admin?page=1&limit=1');
  const jobId = jobsList.json.data?.[0]?._id;
  log('Fetch job for application', jobsList.res.ok && !!jobId, `jobId=${jobId}`);

  if (!jobId) {
    console.error('No jobs found — cannot test application flow.');
    process.exit(1);
  }

  const appPayload = {
    jobId,
    fullName: 'E2E Applicant Test',
    email: testEmail,
    phone: '+1-555-0200',
    currentLocation: 'Remote',
    yearsOfExperience: 3,
    coverLetter: 'This is an automated end-to-end job application test cover letter with sufficient length.',
    portfolio: 'https://example.com/portfolio',
  };

  const created = await request('/api/careers/apply', {
    method: 'POST',
    body: JSON.stringify(appPayload),
  });
  const createdId = created.json.data?._id;
  log('Public submit application', created.res.status === 201 && !!createdId, `id=${createdId}`);

  const getById = await request(`/api/careers/apply/admin/${createdId}`);
  log('Admin get by ID', getById.res.ok && getById.json.data?._id === createdId, `status ${getById.res.status}`);

  const byJob = await request(`/api/careers/jobs/admin/${jobId}/applications?limit=10`);
  const inJobList = (byJob.json.data || []).some((a) => a._id === createdId);
  log('Applications by job', byJob.res.ok && inJobList, `count ${byJob.json.data?.length ?? 0}`);

  const statusUpdate = await request(`/api/careers/apply/admin/${createdId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'Shortlisted' }),
  });
  log('Status update (Pending→Shortlisted)', statusUpdate.res.ok && statusUpdate.json.data?.status === 'Shortlisted', `status=${statusUpdate.json.data?.status}`);

  const softDel = await request(`/api/careers/apply/admin/${createdId}`, { method: 'DELETE' });
  log('Soft delete', softDel.res.ok, `status ${softDel.res.status}`);

  const trashList = await request('/api/careers/apply/admin?trash=true&limit=100');
  const inTrash = (trashList.json.data || []).some((a) => a._id === createdId && a.isDeleted === true);
  log('Trash filter shows deleted item', trashList.res.ok && inTrash, `inTrash=${inTrash}`);

  const restored = await request(`/api/careers/apply/admin/${createdId}/restore`, { method: 'POST' });
  log('Restore', restored.res.ok, `status ${restored.res.status}`);

  const bulkStatus = await request('/api/careers/apply/admin/bulk-status', {
    method: 'POST',
    body: JSON.stringify({ ids: [createdId], status: 'Interview' }),
  });
  const afterBulk = await request(`/api/careers/apply/admin?search=${encodeURIComponent(testEmail)}&limit=10`);
  const bulkItem = (afterBulk.json.data || []).find((a) => a._id === createdId);
  log('Bulk status update', bulkStatus.res.ok && bulkItem?.status === 'Interview', `status=${bulkItem?.status}`);

  const permDel = await request(`/api/careers/apply/admin/${createdId}/permanent`, { method: 'DELETE' });
  log('Permanent delete', permDel.res.ok, `status ${permDel.res.status}`);

  const gone = await request(`/api/careers/apply/admin?search=${encodeURIComponent(testEmail)}&limit=10`);
  const stillExists = (gone.json.data || []).some((a) => a._id === createdId);
  log('Gone after permanent delete', gone.res.ok && !stillExists, `stillExists=${stillExists}`);

  const dashboardCount = await request('/api/careers/apply/admin?page=1&limit=1');
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
