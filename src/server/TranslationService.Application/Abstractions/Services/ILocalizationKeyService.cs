using FluentResults;
using TranslationService.Application.Dtos;

namespace TranslationService.Application.Abstractions.Services;

public interface ILocalizationKeyService
{
	Task<Result<List<LocalizationKeyDto>>> GetAsync(CancellationToken ct = default);
	Task<Result<Guid>> AddAsync(string key, CancellationToken ct = default);
	Task<Result<LocalizationKeyDto>> UpdateAsync(LocalizationKeyDto dto, CancellationToken ct = default);
	Task<Result> DeleteAsync(Guid id, CancellationToken ct = default);
}