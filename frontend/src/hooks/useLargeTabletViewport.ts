import { useSyncExternalStore } from 'react';

const LARGE_TABLET_MEDIA_QUERY = '(min-width: 1024px) and (max-width: 1199px)';

function subscribeLargeTabletViewport(onStoreChange: () => void) {
  const mq = window.matchMedia(LARGE_TABLET_MEDIA_QUERY);
  mq.addEventListener('change', onStoreChange);
  return () => mq.removeEventListener('change', onStoreChange);
}

function getLargeTabletViewportSnapshot() {
  return window.matchMedia(LARGE_TABLET_MEDIA_QUERY).matches;
}

function getLargeTabletViewportServerSnapshot() {
  return false;
}

/** True when viewport width is 1024px–1199px (large tablets / iPad Pro). */
export function useLargeTabletViewport(): boolean {
  return useSyncExternalStore(
    subscribeLargeTabletViewport,
    getLargeTabletViewportSnapshot,
    getLargeTabletViewportServerSnapshot
  );
}
