import { SecurityOptions } from './securityOptions';

export enum Table {
  User = 'users',
  Category = 'categories',
  Publisher = 'publishers',
  Author = 'authors',
  Config = 'configs',
  Banner = 'banners',
  Document = 'documents',
  DocumentComment = 'document_comments',
  DownloadDocument = 'download_documents',
  FavoriteDocument = 'favorite_documents',
  Contact = 'contacts',
  Feedback = 'feedbacks',
}

export const GLOBAL_PREFIX = 'v1';

export const CACHES = {
  LOCKOUT_SESSION: {
    getKey: (userId: string) => `LOCKOUT_SESSION:${userId}`,
  },

  OTP_SESSION: {
    getKey: (userId: string) => `OTP_SESSION:${userId}`,
    expiredTime: SecurityOptions.OTP_EXPIRATION_TIME, // 5 minutes
  },

  RESET_PASSWORD_SESSION: {
    getKey: (userId: string) => `RESET_PASSWORD_SESSION:${userId}`,
    expiredTime: SecurityOptions.OTP_EXPIRATION_TIME, // 5 minutes
  },

  DOCUMENT_SUMMARY: {
    getKey: (documentId: string) => `DOCUMENT_SUMMARY:${documentId}`,
    expiredTime: 30 * 60, // 30 minutes
  },
};

export * from './errorCodes';
export * from './securityOptions';

