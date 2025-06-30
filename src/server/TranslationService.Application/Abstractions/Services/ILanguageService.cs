using FluentResults;
using TranslationService.Persistence.Entities;

namespace TranslationService.Application.Abstractions.Services;

public interface ILanguageService
{
	Task<Result<List<Language>>> GetAsync(bool isSelected, CancellationToken ct = default);
	Task<Result<Guid>> AddAsync(string name, string code, CancellationToken ct = default);
	Task<Result<Language>> UpdateAsync(Language language, CancellationToken ct = default);
	Task<Result> DeleteAsync(Guid id, CancellationToken ct = default);
}