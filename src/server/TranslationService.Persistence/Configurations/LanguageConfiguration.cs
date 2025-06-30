using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TranslationService.Persistence.Entities;

namespace TranslationService.Persistence.Configurations;

public class LanguageConfiguration : IEntityTypeConfiguration<Language>
{
	public void Configure(EntityTypeBuilder<Language> builder)
	{
		builder.HasKey(l => l.Id);

		builder.Property(l => l.Name)
			.IsRequired();

		builder.Property(l => l.Code)
			.IsRequired()
			.HasMaxLength(10);
		
		builder.Property(l => l.IsSelected)
			.HasDefaultValue(false)
			.IsRequired();

		builder.HasIndex(l => new { l.Name, l.Code })
			.IsUnique();
	}
}