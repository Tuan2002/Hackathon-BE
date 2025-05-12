import { BaseCacheService } from '@base/modules/cache/redis.cache.service';
import { CACHES, SecurityOptions } from '@constants';

export class AuthCacheService extends BaseCacheService {
  async setTemporaryLockout(userId: string, lockoutTo: Date) {
    const cacheKey = CACHES.LOCKOUT_SESSION.getKey(userId);
    const value = lockoutTo.toISOString();
    await this.setCache(cacheKey, value, SecurityOptions.LOCKOUT_DURATION);
  }

  async getTemporaryLockout(userId: string) {
    const cacheKey = CACHES.LOCKOUT_SESSION.getKey(userId);
    const lockoutTo = await this.getCache(cacheKey);
    return lockoutTo;
  }

  async setOtpSession(userId: string, otp: string) {
    const cacheKey = CACHES.OTP_SESSION.getKey(userId);
    await this.setCache(cacheKey, otp, CACHES.OTP_SESSION.expiredTime);
  }

  async getOtpSession(userId: string) {
    const cacheKey = CACHES.OTP_SESSION.getKey(userId);
    const otp = await this.getCache(cacheKey);
    return otp;
  }
  async revokeOtpSession(userId: string) {
    const cacheKey = CACHES.OTP_SESSION.getKey(userId);
    await this.deleteCache(cacheKey);
  }
}
