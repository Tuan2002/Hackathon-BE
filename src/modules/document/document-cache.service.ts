import { BaseCacheService } from '@base/modules/cache/redis.cache.service';
import { CACHES } from '@constants';

export class DocumentCacheService extends BaseCacheService {
  setDocumentSummary(documentId: string, summaryContent: string) {
    const cacheKey = CACHES.DOCUMENT_SUMMARY.getKey(documentId);
    return this.setCache(
      cacheKey,
      summaryContent,
      CACHES.DOCUMENT_SUMMARY.expiredTime,
    );
  }

  getDocumentSummary(documentId: string) {
    const cacheKey = CACHES.DOCUMENT_SUMMARY.getKey(documentId);
    return this.getCache(cacheKey);
  }
}
