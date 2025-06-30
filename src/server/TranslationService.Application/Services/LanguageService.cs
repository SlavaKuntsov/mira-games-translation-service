using FluentResults;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TranslationService.Application.Abstractions.Services;
using TranslationService.Persistence;
using TranslationService.Persistence.Entities;

namespace TranslationService.Application.Services;

public class LanguageService(
	ApplicationDbContext dbContext,
	IValidator<Language> validator
) : ILanguageService
{
	public async Task<Result<List<Language>>> GetAsync(bool isSelected, CancellationToken ct = default)
	{
		var query = dbContext.Languages.AsNoTracking();

		if (isSelected)
			query = query.Where(l => l.IsSelected);

		var result = await query.ToListAsync(cancellationToken: ct);

		return Result.Ok(result);
	}

	public async Task<Result<Guid>> AddAsync(string name, string code, CancellationToken ct = default)
	{
		var entity = new Language(name, code);

		var validationResult = await validator.ValidateAsync(entity, ct);
		if (!validationResult.IsValid)
			return Result.Fail(validationResult.Errors.Select(e => e.ErrorMessage).ToList());

		var exists = await dbContext.Languages.AnyAsync(l => l.Code == code, cancellationToken: ct);

		if (exists)
			return Result.Fail(new Error("Language code already exists").WithMetadata("Type", "AlreadyExists"));

		await dbContext.Languages.AddAsync(entity, ct);
		await dbContext.SaveChangesAsync(ct);

		return Result.Ok(entity.Id);
	}

	public async Task<Result<Language>> UpdateAsync(Language language, CancellationToken ct = default)
	{
		var validationResult = await validator.ValidateAsync(language, ct);
		if (!validationResult.IsValid)
			return Result.Fail(validationResult.Errors.Select(e => e.ErrorMessage).ToList());

		var existing = await dbContext.Languages.FindAsync([language.Id], cancellationToken: ct);
		if (existing is null)
			return Result.Fail(new Error("Language not found").WithMetadata("Type", "NotFound"));

		existing.Name = language.Name;
		existing.Code = language.Code;
		existing.IsSelected = language.IsSelected;

		await dbContext.SaveChangesAsync(ct);
		return Result.Ok(existing);
	}

	public async Task<Result> DeleteAsync(Guid id, CancellationToken ct = default)
	{
		var entity = await dbContext.Languages.FindAsync([id], cancellationToken: ct);
		if (entity is null)
			return Result.Fail(new Error("Language not found").WithMetadata("Type", "NotFound"));

		dbContext.Languages.Remove(entity);
		await dbContext.SaveChangesAsync(ct);

		return Result.Ok();
	}
}
