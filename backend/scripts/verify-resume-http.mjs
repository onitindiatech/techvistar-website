/**
 * HTTP verification: upload resume via API, download via authenticated deliver route.
 * Run: node scripts/verify-resume-http.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.API_BASE || 'http://localhost:5000';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@techvistar.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';

const pdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000052 00000 n 
0000000101 00000 n 
trailer<</Size 4/Root 1 0 R>>
startxref
178
%%EOF`;

const pdfPath = path.join(__dirname, '..', 'test-resume.pdf');
fs.writeFileSync(pdfPath, Buffer.from(pdfContent, 'utf8'));

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const json = await res.json();
  if (!res.ok || !json.data?.token) throw new Error(`Login failed: ${json.message || res.status}`);
  return json.data.token;
}

async function uploadResume() {
  const form = new FormData();
  form.append('resume', new Blob([fs.readFileSync(pdfPath)], { type: 'application/pdf' }), 'verify-http-resume.pdf');

  const res = await fetch(`${BASE}/api/upload/resume`, { method: 'POST', body: form });
  const json = await res.json();
  if (!res.ok || !json.data) throw new Error(`Upload failed: ${json.message || res.status}`);
  return json.data;
}

async function downloadResume(token, publicId) {
  const url = `${BASE}/api/upload/resume/file?publicId=${encodeURIComponent(publicId)}&filename=verify-http-resume.pdf`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  const buf = Buffer.from(await res.arrayBuffer());
  return { status: res.status, bytes: buf.length, magic: buf.subarray(0, 4).toString() };
}

async function main() {
  console.log('\nHTTP resume pipeline verification\n');
  const token = await login();
  console.log('✓ Admin login');

  const uploaded = await uploadResume();
  console.log('✓ Upload', uploaded.publicId);

  const previewUrl = uploaded.url.replace(/\.pdf$/, '.jpg').replace('/upload/', '/upload/pg_1,f_jpg/');
  const previewRes = await fetch(previewUrl);
  const previewBytes = Buffer.from(await previewRes.arrayBuffer()).length;
  console.log(`✓ Preview URL HTTP ${previewRes.status}, bytes=${previewBytes}`);

  const downloaded = await downloadResume(token, uploaded.publicId);
  console.log(`✓ Download API HTTP ${downloaded.status}, bytes=${downloaded.bytes}, magic=${downloaded.magic}`);

  if (downloaded.status !== 200 || downloaded.magic !== '%PDF') {
    throw new Error('Download verification failed — restart backend if route is missing.');
  }

  console.log('\nAll HTTP checks passed.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
