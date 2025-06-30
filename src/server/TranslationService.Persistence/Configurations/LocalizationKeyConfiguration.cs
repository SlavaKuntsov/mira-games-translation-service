using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TranslationService.Persistence.Entities;

namespace TranslationService.Persistence.Configurations;

public class LocalizationKeyConfiguration: IEntityTypeConfiguration<LocalizationKey>
{
	public void Configure(EntityTypeBuilder<LocalizationKey> builder)
	{
		builder.HasKey(lk => lk.Id);

		builder.Property(lk => lk.Key)
			.IsRequired();

		builder.HasIndex(lk => lk.Key)
			.IsUnique();
	}
}