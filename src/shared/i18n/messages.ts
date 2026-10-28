export const messages = {
  ar: {
    INVALID_CREDENTIALS: 'بيانات الدخول غير صحيحة',
    ACCOUNT_DISABLED: 'الحساب معطل',
    UNAUTHORIZED: 'غير مصرح',
    FORBIDDEN: 'غير مسموح',
    VALIDATION_ERROR: 'خطأ في التحقق من البيانات',
    NOT_FOUND: 'غير موجود',
    RATE_LIMITED: 'طلبات كثيرة جداً',
    INTERNAL_ERROR: 'خطأ داخلي',
    ITEM_CODE_EXISTS: 'كود الصنف موجود بالفعل',
    USER_NOT_FOUND: 'المستخدم غير موجود',
  },
  en: {
    INVALID_CREDENTIALS: 'Invalid credentials',
    ACCOUNT_DISABLED: 'Account is disabled',
    UNAUTHORIZED: 'Unauthorized',
    FORBIDDEN: 'Forbidden',
    VALIDATION_ERROR: 'Validation failed',
    NOT_FOUND: 'Not found',
    RATE_LIMITED: 'Too many requests',
    INTERNAL_ERROR: 'Internal server error',
    ITEM_CODE_EXISTS: 'Item code already exists',
    USER_NOT_FOUND: 'User not found',
  },
};

export type Lang = 'ar' | 'en';

export const getMessage = (lang: Lang, key: keyof typeof messages.en): string => {
  return messages[lang][key] || messages.en[key];
};
