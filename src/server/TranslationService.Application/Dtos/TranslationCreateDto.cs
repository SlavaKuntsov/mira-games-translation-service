namespace TranslationService.Application.Dtos;

public record TranslationCreateDto(
	// Guid KeyId,
	string Key,
	string LanguageCode,
	string Text);