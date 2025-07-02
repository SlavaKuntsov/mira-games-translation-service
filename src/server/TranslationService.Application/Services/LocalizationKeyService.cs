using FluentResults;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TranslationService.Application.Abstractions.Services;
using TranslationService.Application.Dtos;
using TranslationService.Persistence;
using TranslationService.Persistence.Entities;

namespace TranslationService.Application.Services;

public class LocalizationKeyService(
	ApplicationDbContext dbContext,
	IValidator<LocalizationKey> validator)
	: ILocalizationKeyService
{
	public async Task<Result<List<LocalizationKeyDto>>> GetAsync(CancellationToken ct = default)
	{
		var keys = await dbContext.LocalizationKeys
			.AsNoTracking()
			.Select(k => new LocalizationKeyDto(k.Id, k.Key))
			.ToListAsync(ct);

		return Result.Ok(keys);
	}

	public async Task<Result<Guid>> AddAsync(string key, CancellationToken ct = default)
	{
		var entity = new LocalizationKey(key);

		var validationResult = await validator.ValidateAsync(entity, ct);

		if (!validationResult.IsValid)
			return Result.Fail(
				validationResult.Errors
					.Select(e => e.ErrorMessage)
					.ToList());

		var exists = await dbContext.LocalizationKeys
			.AnyAsync(k => k.Key == key, ct);

		if (exists)
			return Result.Fail(
				new Error("Localization key already exists")
					.WithMetadata("Type", "AlreadyExists"));

		await dbContext.LocalizationKeys.AddAsync(entity, ct);
		await dbContext.SaveChangesAsync(ct);

		return Result.Ok(entity.Id);
	}

	public async Task<Result<LocalizationKeyDto>> UpdateAsync(
		LocalizationKeyDto dto,
		CancellationToken ct = default)
	{
		var entity = new LocalizationKey { Id = dto.Id, Key = dto.Key };

		var validationResult = await validator.ValidateAsync(entity, ct);

		if (!validationResult.IsValid)
			return Result.Fail(
				validationResult.Errors
					.Select(e => e.ErrorMessage)
					.ToList());

		var existing = await dbContext.LocalizationKeys
			.FindAsync([dto.Id], ct);

		if (existing is null)
			return Result.Fail(
				new Error("Localization key not found")
					.WithMetadata("Type", "NotFound"));

		existing.Key = dto.Key;

		await dbContext.SaveChangesAsync(ct);

		return Result.Ok(new LocalizationKeyDto(existing.Id, existing.Key));
	}

	public async Task<Result> DeleteAsync(Guid id, CancellationToken ct = default)
	{
		var entity = await dbContext.LocalizationKeys
			.FindAsync([id], ct);

		if (entity is null)
			return Result.Fail(
				new Error("Localization key not found")
					.WithMetadata("Type", "NotFound"));

		dbContext.LocalizationKeys.Remove(entity);
		await dbContext.SaveChangesAsync(ct);

		return Result.Ok();
	}
}