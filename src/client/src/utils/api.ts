import { setLanguages } from '@/lib/language-store';
import type { Language, Translation, TranslationsResponse } from '@/types/table-types';
import { LanguagesResponseSchema, TranslationsResponseSchema } from '@/types/table-types';

export async function getLanguages(): Promise<Language[]> {
	try {
		const res = await fetch(
			'http://localhost:7000/api/v1/languages?isSelected=false'
		);

		if (!res.ok) {
			throw new Error(
				`Failed to fetch languages: ${res.status} ${res.statusText}`
			);
		}

		const rawData: unknown = await res.json();

		// Валидация с помощью Zod
		const validatedData = LanguagesResponseSchema.parse(rawData);

		const languages = validatedData.data;

		// Обновляем store с полными объектами языков
		setLanguages(languages);

		return languages;
	} catch (error) {
		console.error('Error fetching languages:', error);

		// Fallback данные в случае ошибки
		const fallbackLanguages: Language[] = [
			{
				id: '9cb8bcf2-7095-4ef7-b3f0-3f71de790404',
				name: 'Russian',
				code: 'ru',
				isSelected: true,
				translations: [],
			},
			{
				id: '3ca75a35-7311-4a4c-b56d-e90f0a6c4307',
				name: 'English',
				code: 'en',
				isSelected: false,
				translations: [],
			},
		];

		setLanguages(fallbackLanguages);
		return fallbackLanguages;
	}
}

export interface PaginatedTranslations {
  items: Translation[];
  totalPages: number;
}

export async function getTranslations(
  pageNumber = 1,
  pageSize = 10,
  sortByAsc = true
): Promise<PaginatedTranslations> {
  const url = new URL('http://localhost:7000/api/v1/translations');
  url.searchParams.set('pageNumber', String(pageNumber));
  url.searchParams.set('pageSize', String(pageSize));
  url.searchParams.set('sortByAsc', String(sortByAsc));

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`Failed to fetch translations: ${res.status} ${res.statusText}`);
  }

  const raw: unknown = await res.json();
  const parsed = TranslationsResponseSchema.parse(raw) as TranslationsResponse;
  const pagination = parsed.data;

  const items: Translation[] = pagination.data.map(record => {
    const translationsMap: Record<string, string> = {};
    record.translations.forEach(t => {
      translationsMap[t.languageCode] = t.text;
    });
    return {
      id: record.keyId,
      key: record.key,
      translations: translationsMap,
    };
  });

  return {
    items,
    totalPages: pagination.totalPages,
  };
}


export async function createTranslation(
  key: string,
  languageCode: string,
  text: string
): Promise<string> {
  const res = await fetch('http://localhost:7000/api/v1/translations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key, languageCode, text }),
  });
  if (!res.ok) throw new Error(`Failed to create translation: ${res.status}`);
  const json = await res.json();
  // сервер возвращает { data: "<newId>" }
  return json.data as string;
}
