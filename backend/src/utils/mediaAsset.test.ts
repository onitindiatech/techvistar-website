/**
 * @file src/utils/mediaAsset.test.ts
 * @description Lightweight regression tests for Cloudinary media lifecycle helpers.
 * Run: npm test
 */

import assert from 'assert';
import {
  extractCloudinaryPublicId,
  isCloudinaryDeliveryUrl,
  publicIdForUrl,
  syncScalarMediaFields,
  syncGalleryMedia,
  collectDocumentPublicIds,
  obsoleteJobMediaPublicIds,
  collectJobMediaPublicIds,
  SERVICE_MEDIA_FIELDS,
  PROJECT_MEDIA_FIELDS,
} from '@/utils/mediaAsset';

function run(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
  } catch (err) {
    console.error(`  ✗ ${name}`);
    throw err;
  }
}

console.log('\n[mediaAsset] Cloudinary lifecycle helpers\n');

run('detects Cloudinary delivery URLs', () => {
  assert.strictEqual(
    isCloudinaryDeliveryUrl(
      'https://res.cloudinary.com/test-cloud/image/upload/v1/techvistar/uploads/abc.jpg'
    ),
    true
  );
  assert.strictEqual(
    isCloudinaryDeliveryUrl('https://images.unsplash.com/photo-123'),
    false
  );
  assert.strictEqual(isCloudinaryDeliveryUrl('serviceWebDev'), false);
});

run('extracts public_id from versioned Cloudinary URL', () => {
  const id = extractCloudinaryPublicId(
    'https://res.cloudinary.com/test-cloud/image/upload/v1783513184/techvistar/uploads/x0kbffsos.jpg'
  );
  assert.strictEqual(id, 'techvistar/uploads/x0kbffsos');
});

run('extracts public_id from transformed Cloudinary URL', () => {
  const id = extractCloudinaryPublicId(
    'https://res.cloudinary.com/demo/image/upload/c_fill,w_300/v123/folder/name.png'
  );
  assert.strictEqual(id, 'folder/name');
});

run('accepts raw techvistar public_id', () => {
  assert.strictEqual(
    extractCloudinaryPublicId('techvistar/uploads/abc123'),
    'techvistar/uploads/abc123'
  );
});

run('returns empty for Unsplash / legacy keys', () => {
  assert.strictEqual(
    extractCloudinaryPublicId(
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1200'
    ),
    ''
  );
  assert.strictEqual(extractCloudinaryPublicId('serviceWebDev'), '');
  assert.strictEqual(extractCloudinaryPublicId(''), '');
});

run('syncScalarMediaFields derives publicIds and marks obsolete', () => {
  const previous = {
    coverImage:
      'https://res.cloudinary.com/demo/image/upload/v1/techvistar/uploads/old.jpg',
    coverImagePublicId: 'techvistar/uploads/old',
    thumbnail: 'https://images.unsplash.com/photo-x',
    thumbnailPublicId: '',
  };

  const next = {
    coverImage:
      'https://res.cloudinary.com/demo/image/upload/v2/techvistar/uploads/new.jpg',
    thumbnail: 'https://images.unsplash.com/photo-x',
  };

  const { payload, obsoletePublicIds } = syncScalarMediaFields(
    previous,
    next,
    SERVICE_MEDIA_FIELDS
  );

  assert.strictEqual(payload.coverImagePublicId, 'techvistar/uploads/new');
  assert.strictEqual(payload.thumbnailPublicId, '');
  assert.deepStrictEqual(obsoletePublicIds, ['techvistar/uploads/old']);
});

run('syncGalleryMedia removes obsolete gallery assets', () => {
  const result = syncGalleryMedia(
    [
      'https://res.cloudinary.com/demo/image/upload/v1/techvistar/uploads/a.jpg',
      'https://res.cloudinary.com/demo/image/upload/v1/techvistar/uploads/b.jpg',
    ],
    ['techvistar/uploads/a', 'techvistar/uploads/b'],
    ['https://res.cloudinary.com/demo/image/upload/v1/techvistar/uploads/b.jpg']
  );

  assert.deepStrictEqual(result.galleryPublicIds, ['techvistar/uploads/b']);
  assert.deepStrictEqual(result.obsoletePublicIds, ['techvistar/uploads/a']);
});

run('collectDocumentPublicIds gathers scalar + gallery ids', () => {
  const ids = collectDocumentPublicIds(
    {
      thumbnail:
        'https://res.cloudinary.com/demo/image/upload/v1/techvistar/uploads/thumb.jpg',
      thumbnailPublicId: 'techvistar/uploads/thumb',
      gallery: [
        'https://res.cloudinary.com/demo/image/upload/v1/techvistar/uploads/g1.jpg',
      ],
      galleryPublicIds: ['techvistar/uploads/g1'],
    },
    PROJECT_MEDIA_FIELDS,
    { urlsKey: 'gallery', publicIdsKey: 'galleryPublicIds' }
  );

  assert.deepStrictEqual(
    ids.sort(),
    ['techvistar/uploads/g1', 'techvistar/uploads/thumb'].sort()
  );
});

run('Job description packed URLs are collected / compared', () => {
  const prev =
    'Short<!-- split -->Full<!-- split -->https://res.cloudinary.com/demo/image/upload/v1/techvistar/uploads/banner.jpg<!-- split -->https://res.cloudinary.com/demo/image/upload/v1/techvistar/uploads/office.jpg<!-- split -->';
  const next =
    'Short<!-- split -->Full<!-- split -->https://res.cloudinary.com/demo/image/upload/v1/techvistar/uploads/banner2.jpg<!-- split -->https://res.cloudinary.com/demo/image/upload/v1/techvistar/uploads/office.jpg<!-- split -->';

  assert.ok(collectJobMediaPublicIds(prev).includes('techvistar/uploads/banner'));
  assert.deepStrictEqual(obsoleteJobMediaPublicIds(prev, next), [
    'techvistar/uploads/banner',
  ]);
});

run('publicIdForUrl prefers explicit publicId', () => {
  assert.strictEqual(
    publicIdForUrl('https://res.cloudinary.com/demo/image/upload/v1/a/b.jpg', 'custom/id'),
    'custom/id'
  );
});

console.log('\nAll mediaAsset tests passed.\n');
