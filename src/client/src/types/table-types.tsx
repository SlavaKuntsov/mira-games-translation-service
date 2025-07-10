import { z } from 'zod';

// Схема для Language с полями из API
export const LanguageSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string(),
  isSelected: z.boolean(),
  translations: z.array(z.any()).optional(), // Можно уточнить тип если нужно
});

export type Language = z.infer<typeof LanguageSchema>;

// Схема для массива языков из API ответа
export const LanguagesResponseSchema = z.object({
  data: z.array(LanguageSchema)
});

export type LanguagesResponse = z.infer<typeof LanguagesResponseSchema>;

// Схема для отдельного перевода из API
export const TranslationItemSchema = z.object({
  languageCode: z.string(),
  text: z.string(),
});

export type TranslationItem = z.infer<typeof TranslationItemSchema>;

// Схема для записи с переводами из API
export const TranslationRecordSchema = z.object({
  keyId: z.string().uuid(),
  key: z.string(),
  translations: z.array(TranslationItemSchema),
});

export type TranslationRecord = z.infer<typeof TranslationRecordSchema>;

// Схема для пагинации
export const PaginationSchema = z.object({
  currentPage: z.number(),
  pageSize: z.number(),
  totalRecords: z.number(),
  totalPages: z.number(),
  data: z.array(TranslationRecordSchema),
});

export type Pagination = z.infer<typeof PaginationSchema>;

// Схема для ответа API с переводами
export const TranslationsResponseSchema = z.object({
  data: PaginationSchema
});

export type TranslationsResponse = z.infer<typeof TranslationsResponseSchema>;

// Преобразованная схема для работы с таблицей (плоская структура)
export const TranslationSchema = z.object({
  id: z.string(),
  key: z.string(),
  translations: z.record(z.string(), z.string().optional()),
});

export type Translation = z.infer<typeof TranslationSchema>;

// Базовая схема для переводов (динамически создается на основе доступных языков)
export function createTranslationsSchema(languageCodes: string[]) {
  const translationsShape = languageCodes.reduce((acc, code) => {
    acc[code] = z.string().optional();
    return acc;
  }, {} as Record<string, z.ZodOptional<z.ZodString>>);

  return z.object(translationsShape).refine(
    (val) => Object.values(val).some(v => v && v.trim() !== ''),
    { message: 'At least one translation must be filled' }
  );
}
