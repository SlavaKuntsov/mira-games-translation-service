namespace TranslationService.Persistence.Entities;

public class LocalizationKey
{
	public Guid Id { get; set; }
	public string Key { get; set; } = string.Empty; 

	public virtual ICollection<Translation> Translations { get; set; } = [];
}