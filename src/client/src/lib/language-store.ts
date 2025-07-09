import type { Language } from '@/types/table-types';

let loadedLanguages: Language[] | null = null;
let selectedLanguages: Language[] | null = ['ru', 'en'];

export function setLanguages(langs: Language[]) {
	loadedLanguages = langs;
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

export function isLanguagesLoaded(): boolean {
	return Array.isArray(loadedLanguages);
}

export function isselectedLanguagesLoaded(): boolean {
	return Array.isArray(selectedLanguages);
}

export function clearLanguages() {
	loadedLanguages = null;
}
