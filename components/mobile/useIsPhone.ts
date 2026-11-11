'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(max-width: 1023px)';

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener('change', onChange);
  return () => mq.removeEventListener('change', onChange);
}

/** true on phones/tablets (<1024px), false on laptop, null until the browser has answered (render nothing then). */
export function useIsPhone(): boolean | null {
  return useSyncExternalStore<boolean | null>(subscribe, () => window.matchMedia(QUERY).matches, () => null);
}
