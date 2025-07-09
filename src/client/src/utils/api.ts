import { setLanguages } from "@/lib/language-store";
import type { Language, Translation } from "@/types/table-types";
import { TranslationSchema } from "@/types/table-types";

export async function getLanguages(): Promise<Language[]> {
	// пример получения языков с бэкенда
	// const res = await fetch('/api/languages')
	// if (!res.ok) throw new Error('Failed to fetch languages')
	// const langs: unknown = await res.json()
	// Валидация с zod, если надо
	// return langs as Language[]
  setLanguages(['ru', 'en', 'tr'])
  return ['ru', 'en', 'tr'];
}


// 2) Эмуляция «запроса» данных
export async function getData(): Promise<Translation[]> {
  const raw = [
    {
      id: "728e3d52f",
      key: "greeting11111111111111111111",
      translations: {
        ru: "Привет111111111111111",
        en: "Hello1111111111111",
        tr: "Merhaba11111111111111"
      }
    },
    {
      id: "7284ed52f",
      key: "farewell",
      translations: {
        ru: "Пока",
        en: "Goodbye",
        tr: "Güle güle"
      }
    },
    {
      id: "677ed52f",
      key: "thanks",
      translations: {
        ru: "Спасибо",
        en: "Thank you",
        tr: "Teşekkürler"
      }
    },
    {
      id: "738ed52f",
      key: "yes",
      translations: {
        ru: "Да",
        en: "Yes",
        tr: "Evet"
      }
    },
    {
      id: "128ed52f",
      key: "no",
      translations: {
        ru: "Нет",
        en: "No",
        tr: "Hayır"
      }
    },
    {
      id: "828ed52f",
      key: "good",
      translations: {
        ru: "Хорошо",
        en: "Good",
        tr: "İyi"
      }
    },
    {
      id: "928ed52f",
      key: "bad",
      translations: {
        ru: "Плохо",
        en: "Bad",
        tr: "Kötü"
      }
    },
    {
      id: "a28ed52f",
      key: "see_you",
      translations: {
        ru: "Увидимся",
        en: "See you",
        tr: "Görüşürüz"
      }
    },
    {
      id: "528ed52f",
      key: "evening",
      translations: {
        ru: "Вечер",
        en: "Evening",
        tr: "Akşam"
      }
    },
    {
      id: "628ed52f",
      key: "night",
      translations: {
        ru: "Ночь",
        en: "Night",
        tr: "Gece"
      }
    },
    {
      id: "728ed52g",
      key: "how_are_you",
      translations: {
        ru: "Как дела?",
        en: "How are you?",
        tr: "Nasılsın?"
      }
    },
  ]

  // Парсим каждый объект
  const parsed = raw.map((item) => TranslationSchema.parse(item))
  // эмулируем задержку
  await new Promise((r) => setTimeout(r, 500))
  return parsed
}
