/**
 * End-to-end resume pipeline verification.
 * Run: npx ts-node -r tsconfig-paths/register scripts/verify-resume-pipeline.ts
 */
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MINIMAL_PDF = Buffer.from(
  `%PDF-1.4
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
%%EOF`,
  'utf8',
);

async function main(): Promise<void> {
  const {
    buildResumePreviewUrl,
    buildResumeDownloadUrl,
    findLocalResumePath,
    persistResumeLocally,
    resolveResumeFormat,
  } = await import('../src/utils/resumeAsset');
  const { cloudinaryService } = await import('../src/services/cloudinary.service');

  const file = {
    buffer: MINIMAL_PDF,
    mimetype: 'application/pdf',
    originalname: 'pipeline-test-resume.pdf',
    size: MINIMAL_PDF.length,
  };

  console.log('\n1) Upload to Cloudinary');
  const uploaded = await cloudinaryService.uploadResume(file);
  console.log(uploaded);

  const format = resolveResumeFormat(file.mimetype, file.originalname);
  await persistResumeLocally(uploaded.publicId, file.buffer, format);

  const asset = {
    resumeUrl: uploaded.url,
    resumePublicId: uploaded.publicId,
    resumeMimeType: uploaded.mimeType,
    originalFileName: uploaded.originalFileName,
  };

  console.log('\n2) Local backup');
  const localPath = await findLocalResumePath(uploaded.publicId);
  console.log('local path found:', localPath);

  console.log('\n3) Preview URL');
  const previewUrl = buildResumePreviewUrl(asset);
  console.log(previewUrl);
  const previewRes = await fetch(previewUrl!);
  const previewBuf = Buffer.from(await previewRes.arrayBuffer());
  console.log(`preview -> HTTP ${previewRes.status}, bytes=${previewBuf.length}, jpeg=${previewBuf[0] === 0xff && previewBuf[1] === 0xd8}`);

  console.log('\n4) Direct PDF CDN URL (expected blocked on free plan)');
  const pdfRes = await fetch(uploaded.url);
  console.log(`secure_url -> HTTP ${pdfRes.status}, bytes=${(await pdfRes.arrayBuffer()).byteLength}`);

  console.log('\n5) Download route path');
  const downloadPath = buildResumeDownloadUrl(asset, 'http://localhost:5000');
  console.log(downloadPath);

  console.log('\nPipeline verification complete.\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
