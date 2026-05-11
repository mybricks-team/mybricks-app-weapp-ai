export type OperateApiSummaryFiles = {
  apiScheme: any[];
  requirement: string;
};

export type SummaryCacheItem = {
  fingerprint: string;
  summary: string;
  updatedAt: number;
};

const SUMMARY_CACHE_EXPIRE_MS = 30 * 60 * 1000;
const summaryCacheMap = new Map<string, SummaryCacheItem>();

export function buildOperateApiFingerprint(filesObj: OperateApiSummaryFiles, userMessage: string) {
  return JSON.stringify({
    apiScheme: filesObj.apiScheme,
    requirement: filesObj.requirement,
    userMessage,
  });
}

export function getOperateApiSummaryCache(fileId: string, fingerprint: string) {
  const cache = summaryCacheMap.get(fileId);
  if (!cache) {
    return null;
  }

  if (Date.now() - cache.updatedAt > SUMMARY_CACHE_EXPIRE_MS) {
    summaryCacheMap.delete(fileId);
    return null;
  }

  if (cache.fingerprint !== fingerprint) {
    return null;
  }

  return cache.summary;
}

export function setOperateApiSummaryCache(fileId: string, fingerprint: string, summary: string) {
  summaryCacheMap.set(fileId, {
    fingerprint,
    summary,
    updatedAt: Date.now(),
  });
}
