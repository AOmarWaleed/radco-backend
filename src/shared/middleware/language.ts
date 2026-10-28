import { Request, Response, NextFunction } from 'express';

export interface LanguageRequest extends Request {
  lang?: 'ar' | 'en';
}

export const languageMiddleware = (req: LanguageRequest, res: Response, next: NextFunction) => {
  const acceptLanguage = req.headers['accept-language'] || 'ar';
  const lang = acceptLanguage.toLowerCase().startsWith('en') ? 'en' : 'ar';
  req.lang = lang;
  next();
};
