﻿using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TranslationService.Persistence.Entities;

namespace TranslationService.Persistence.Configurations;

public class TranslationConfiguration: IEntityTypeConfiguration<Translation>
{
	public void Configure(EntityTypeBuilder<Translation> builder)
	{
		builder.Property(t => t.Id)
			.IsRequired();

		builder.Property(t => t.Text)
			.IsRequired(false);

		builder.HasOne(t => t.LocalizationKey)
			.WithMany(lk => lk.Translations)
			.HasForeignKey(t => t.LocalizationKeyId);

		builder.HasOne(t => t.Language)
			.WithMany()
			.HasForeignKey(t => t.LanguageId);

		builder.HasIndex(t => new { t.LocalizationKeyId, t.LanguageId })
			.IsUnique();
	}
}