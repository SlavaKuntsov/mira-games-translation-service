namespace TranslationService.Persistence.Entities;

public class Translation
{
	public Guid Id { get; set; }
	public Guid LocalizationKeyId { get; set; }
	public Guid LanguageId { get; set; }
	public string? Text { get; set; }

	public virtual Language Language { get; set; } = null!;
	public virtual LocalizationKey LocalizationKey { get; set; } = null!;
}