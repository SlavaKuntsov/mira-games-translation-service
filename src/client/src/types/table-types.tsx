import { z } from 'zod';

export const LanguageEnum = z.enum(['ru', 'en', 'tr']);
export type Language = z.infer<typeof LanguageEnum>;

// Список языков как массив
export const ALL_LANGUAGES: Language[] = LanguageEnum.options as Language[];

// Базовая схема с пустыми строками
const TranslationsShape = z.object({
  ru: z.string().optional(),
  en: z.string().optional(),
  tr: z.string().optional(),
});

export const TranslationSchema = z.object({
	id: z.union([z.string(), z.number()]),
  key: z.string(),
  translations: TranslationsShape.refine(
    (val) => Object.values(val).some(v => v && v.trim() !== ''),
    { message: 'At least one translation must be filled' }
  ),
});

export type Translation = z.infer<typeof TranslationSchema>;
