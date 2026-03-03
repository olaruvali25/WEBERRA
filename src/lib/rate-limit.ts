const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

type Store = Map<string, number>;

declare global {
  // eslint-disable-next-line no-var
  var __atelierVectorRateLimit__: Store | undefined;
}

const store = global.__atelierVectorRateLimit__ ?? new Map<string, number>();

if (!global.__atelierVectorRateLimit__) {
  global.__atelierVectorRateLimit__ = store;
}

export function checkRateLimit(key: string) {
  const now = Date.now();
  const previous = store.get(key);

  for (const [entryKey, timestamp] of store.entries()) {
    if (now - timestamp > RATE_LIMIT_WINDOW_MS) {
      store.delete(entryKey);
    }
  }

  if (previous && now - previous < RATE_LIMIT_WINDOW_MS) {
    return {
      allowed: false,
      retryAfterMs: RATE_LIMIT_WINDOW_MS - (now - previous)
    };
  }

  store.set(key, now);

  return {
    allowed: true,
    retryAfterMs: 0
  };
}
