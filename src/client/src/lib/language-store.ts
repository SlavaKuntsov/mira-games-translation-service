import type { Language } from '@/types/table-types';

let loadedLanguages: Language[] | null = null;
let selectedLanguages: Language[] | null = null;

export function setLanguages(langs: Language[]) {
	loadedLanguages = langs;
	
	// Автоматически устанавливаем выбранные языки из isSelected
	const selected = langs.filter(lang => lang.isSelected);
	if (selected.length > 0) {
		selectedLanguages = selected;
	}
}

export function setSelectedLanguages(langs: Language[]) {
	selectedLanguages = langs;
}

export function getLanguagesSync(): Language[] {
	if (!loadedLanguages) throw new Error('Languages not loaded yet');
	return loadedLanguages;
}

export function getSelectedLanguagesSync(): Language[] {
	if (!selectedLanguages) throw new Error('Selected languages not loaded yet');
	return selectedLanguages;
}

export function getLanguageByCode(code: string): Language | undefined {
	if (!loadedLanguages) return undefined;
	return loadedLanguages.find(lang => lang.code === code);
}

export function getLanguagesByCode(codes: string[]): Language[] {
	if (!loadedLanguages) return [];
	return loadedLanguages.filter(lang => codes.includes(lang.code));
}

export function isLanguagesLoaded(): boolean {
	return Array.isArray(loadedLanguages);
}

export function isSelectedLanguagesLoaded(): boolean {
	return Array.isArray(selectedLanguages);
}

export function clearLanguages() {
	loadedLanguages = null;
	selectedLanguages = null;
}

// Утилиты для работы с кодами языков
export function getLanguageCodesSync(): string[] {
	if (!loadedLanguages) throw new Error('Languages not loaded yet');
	return loadedLanguages.map(lang => lang.code);
}

export function getSelectedLanguageCodesSync(): string[] {
	if (!selectedLanguages) throw new Error('Selected languages not loaded yet');
	return selectedLanguages.map(lang => lang.code);
}

// Проверка существования языка
export function hasLanguage(code: string): boolean {
	if (!loadedLanguages) return false;
	return loadedLanguages.some(lang => lang.code === code);
}

// Получение имени языка по коду
export function getLanguageNameByCode(code: string): string | undefined {
	const language = getLanguageByCode(code);
	return language?.name;
}
