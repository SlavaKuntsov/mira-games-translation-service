namespace TranslationService.Application.Dtos;

public record LanguageUpdateDto(
	string Name,
	string Code,
	bool IsSelected);