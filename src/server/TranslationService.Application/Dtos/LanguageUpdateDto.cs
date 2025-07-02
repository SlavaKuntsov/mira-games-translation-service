namespace TranslationService.Application.Dtos;

public sealed record LanguageUpdateDto(
	string Name,
	string Code,
	bool IsSelected);